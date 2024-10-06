import enrollmentRepo from "@/repositories/enrollment.repo";
import { GetEnrollmentsProps } from "@/types/enrollment";
import { generateEnrollmentFilter } from "@/utils/generateEnrollmentFilter";

class StudentService {
  private section = StudentService.name;

  getEnrolledCourses = async (query: GetEnrollmentsProps) => {
    const { filter, options } = generateEnrollmentFilter(query);
    return await enrollmentRepo.getMany(filter, options);
  };
}

export default new StudentService();
