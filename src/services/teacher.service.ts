import { CustomError } from "@/configs";
import teacherRepo from "@/repositories/teacher.repo";
import { Teacher } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

class TeacherService {
  private section = TeacherService.name;
  getATeacher = async (filter: Pick<Teacher, "id">, options?: object) => {
    const { id } = filter;
    const teacher = await teacherRepo.getOne({ id }, options);
    if (!teacher) {
      throw new CustomError(
        "Teacher not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return teacher;
  };
}
export default new TeacherService();
