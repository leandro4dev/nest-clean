import { PaginatinParams } from "@/core/repositories/pagination-params";
import { AnswerComments } from "../../enterprise/entities/answer-comments";

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComments): Promise<void>;
  findManyByAnswerId(
    questionId: string,
    params: PaginatinParams,
  ): Promise<AnswerComments[]>;
  findById(id: string): Promise<AnswerComments | null>;
  delete(answerComments: AnswerComments): Promise<void>;
}
