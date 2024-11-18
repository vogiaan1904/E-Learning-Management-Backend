import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import enrollmentRepo from "@/repositories/enrollment.repo";
import moduleRepo from "@/repositories/module.repo";
import questionRepo from "@/repositories/question.repo";
import quizzRepo from "@/repositories/quizz.repo";
import quizzSubmissionRepo from "@/repositories/quizzSubmission.repo";
import { Option } from "@/types/question";
import {
  CreateQuizzProps,
  GetQuizzesProp,
  UpdateQuizzProps,
} from "@/types/quizz";
import {
  SubmissionAnswer,
  SubmissionEvaluation,
} from "@/types/quizzSubmission";
import { UserPayload } from "@/types/user";
import { Prisma } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";

class QuizzService {
  private section = QuizzService.name;
  private getCourseByModuleId = async (moduleId: string) => {
    const module = await moduleRepo.getOne({ id: moduleId });
    if (!module) {
      throw new CustomError(
        "Module not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const course = await courseRepo.getOne({ id: module.courseId });
    if (!course) {
      throw new CustomError(
        "Coursse not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    return course;
  };
  createQuizz = async (data: CreateQuizzProps, user: UserPayload) => {
    const { moduleId } = data;
    const course = await this.getCourseByModuleId(moduleId);

    if (user.role.toString() !== "admin") {
      if (course.teacherId !== user.id) {
        throw new CustomError(
          "Course not belong to teacher",
          StatusCodes.FORBIDDEN,
          this.section,
        );
      }
    }
    const numQuizzes = await quizzRepo.getMany({ moduleId });

    const position = numQuizzes.length;

    const quizz = await quizzRepo.create(data, position);
    console.log("test workflow");
    return quizz;
  };

  getQuizz = async (filter: Prisma.QuizzWhereInput) => {
    const quizz = await quizzRepo.getOne(filter, {
      include: {
        questions: true,
      },
    });
    if (!quizz) {
      throw new CustomError(
        "Quizz not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return quizz;
  };
  getQuizzes = async (filter: GetQuizzesProp) => {
    const quizzes = await quizzRepo.getMany(filter);
    return quizzes;
  };

  updateQuizz = async (
    filter: Prisma.QuizzWhereUniqueInput,
    data: UpdateQuizzProps,
    user: UserPayload,
  ) => {
    const quizz = await quizzRepo.getOne(filter);
    if (!quizz) {
      throw new CustomError(
        "Quizz not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const course = await this.getCourseByModuleId(quizz.moduleId);

    if (user.role.toString() !== "admin") {
      if (course.teacherId !== user.id) {
        throw new CustomError(
          "Course not belong to teacher",
          StatusCodes.FORBIDDEN,
          this.section,
        );
      }
    }
    return await quizzRepo.update(filter, data);
  };

  deleteQuizz = async (
    filter: Prisma.QuizzWhereUniqueInput,
    user: UserPayload,
  ) => {
    const quizz = await quizzRepo.getOne(filter);
    if (!quizz) {
      throw new CustomError(
        "Quizz not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const course = await this.getCourseByModuleId(quizz.moduleId);

    if (user.role.toString() !== "admin") {
      if (course.teacherId !== user.id) {
        throw new CustomError(
          "Course not belong to teacher",
          StatusCodes.FORBIDDEN,
          this.section,
        );
      }
    }
    return await quizzRepo.delete(filter);
  };

  startQuizz = async (quizzId: string, studentId: string) => {
    // Fetch the quizz to get timeLimit

    const quizz = await quizzRepo.getOne(
      { id: quizzId },
      { include: { questions: true } },
    );

    if (!quizz) {
      throw new CustomError(
        "Quizz not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }

    const course = await this.getCourseByModuleId(quizz.moduleId);

    // Fetch or create Enrollment
    const enrollment = await enrollmentRepo.getOne({
      studentId: studentId,
      courseId: course.id,
    });

    if (!enrollment) {
      throw new CustomError(
        "Enrollment not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }

    // Calculate dueAt
    const dueAt = dayjs().add(quizz.timeLimit, "minute").toDate();

    // Create QuizzSubmission
    const submission = await quizzSubmissionRepo.create({
      quizzId,
      enrollmentId: enrollment.id,
      dueAt,
    });

    return submission;
  };

  submitQuizz = async (
    quizzId: string,
    submissionId: string,
    userId: string,
    submissionAnswers: SubmissionAnswer[],
  ) => {
    // Fetch the QuizzSubmission
    const submission = await quizzSubmissionRepo.getOne(
      { id: submissionId },
      { include: { enrollment: true } },
    );

    if (!submission) {
      throw new CustomError(
        "QuizzSubmission not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }

    const enrollment = await enrollmentRepo.getOne({
      id: submission.enrollmentId,
    });

    if (!enrollment) {
      throw new CustomError(
        "Enrollment not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }

    if (enrollment.studentId !== userId) {
      throw new CustomError(
        "Unauthorized access to this submission.",
        StatusCodes.UNAUTHORIZED,
        this.section,
      );
    }

    if (submission.status === "COMPLETED") {
      throw new CustomError(
        "Quiz has already been submitted.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }

    const now = new Date();
    if (now > submission.dueAt) {
      throw new CustomError(
        "Quiz submission time has expired.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }

    // Fetch the Quizz with questions and options
    const quizz = await quizzRepo.getOne(
      { id: quizzId },
      { include: { questions: true } },
    );

    if (!quizz) {
      throw new CustomError(
        "Quizz not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }

    const submissionEvaluations: SubmissionEvaluation[] = [];
    let totalScore = 0;

    const questions = await questionRepo.getMany({
      quizzId: quizz.id,
    });

    const totalQuestions = questions.length;

    // Evaluate each submissionAnswer
    for (const submissionAnswer of submissionAnswers) {
      const question = questions.find(
        (q) => q.id === submissionAnswer.questionId,
      );
      if (!question) {
        submissionEvaluations.push({
          questionId: submissionAnswer.questionId,
          correct: false,
          selectedOptionContents: submissionAnswer.selectedOptions,
          correctOptionContents: [],
          message: "Question not found.",
        });
        continue;
      }

      const optionsObjs: Option[] = question.options as unknown as Option[];

      // Find selected option
      const selectedOptionObjs: Option[] = optionsObjs.filter((opt) =>
        submissionAnswer.selectedOptions.includes(opt.option),
      );
      console.log("selectedOptionObjs", selectedOptionObjs);

      console.log("selectedOptions", submissionAnswer.selectedOptions);

      if (
        selectedOptionObjs.length !== submissionAnswer.selectedOptions.length
      ) {
        submissionEvaluations.push({
          questionId: submissionAnswer.questionId,
          correct: false,
          selectedOptionContents: submissionAnswer.selectedOptions,
          correctOptionContents: [],
          message: "One or more selected options are invalid.",
        });
        continue;
      }

      const correctOptions = optionsObjs
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.option);
      const selectedCorrectOptions = selectedOptionObjs
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.option);
      const selectedIncorrectOptions = selectedOptionObjs
        .filter((opt) => !opt.isCorrect)
        .map((opt) => opt.option);

      const isCorrect =
        selectedCorrectOptions.length === correctOptions.length &&
        selectedIncorrectOptions.length === 0;

      if (isCorrect) {
        totalScore += 1; // Increment score for correct submissionAnswer
      }

      submissionEvaluations.push({
        questionId: submissionAnswer.questionId,
        correct: isCorrect,
        selectedOptionContents: submissionAnswer.selectedOptions,
        correctOptionContents: correctOptions,
      });
    }

    const percentage =
      totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

    // Update QuizzSubmission
    const updatedSubmission = await quizzSubmissionRepo.update(
      { id: submissionId },
      {
        score: totalScore,
        status: "COMPLETED",
        submissionEvaluations:
          submissionEvaluations as unknown as InputJsonValue[],
        submittedAt: now,
      },
    );

    if (percentage > 50) {
      await enrollmentRepo.update(
        {
          id: enrollment.id,
        },
        {
          completedModulesIds: {
            push: quizz.moduleId,
          },
        },
      );
    }

    return updatedSubmission;
  };
}

export default new QuizzService();
