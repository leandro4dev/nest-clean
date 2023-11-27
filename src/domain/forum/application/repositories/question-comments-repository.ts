import { PaginatinParams } from "@/core/repositories/pagination-params";
import { QuestionComments } from "../../enterprise/entities/question-comments";

export interface QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComments | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginatinParams,
  ): Promise<QuestionComments[]>;
  create(questionComment: QuestionComments): Promise<void>;
  delete(questionComments: QuestionComments): Promise<void>;
}
