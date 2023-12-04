import { Student } from "../../enterprise/entities/student";

export abstract class StudentRespository {
  abstract findByEmail(email: string): Promise<Student | null>;
  abstract create(student: Student): Promise<void>;
}
