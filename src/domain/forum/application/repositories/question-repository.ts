import { PaginatinParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";

export interface QuestionsRespository {
  findById(id: string): Promise<Question | null>;
  findManyRecent(params: PaginatinParams): Promise<Question[]>;
  findBySlug(slug: string): Promise<Question | null>;
  save(question: Question): Promise<void>;
  create(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
}
