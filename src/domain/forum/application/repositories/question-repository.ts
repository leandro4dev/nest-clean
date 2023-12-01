import { PaginatinParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";

export abstract class QuestionsRespository {
  abstract findById(id: string): Promise<Question | null>;
  abstract findManyRecent(params: PaginatinParams): Promise<Question[]>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract save(question: Question): Promise<void>;
  abstract create(question: Question): Promise<void>;
  abstract delete(question: Question): Promise<void>;
}
