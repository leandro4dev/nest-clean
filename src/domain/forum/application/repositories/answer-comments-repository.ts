import { PaginatinParams } from "@/core/repositories/pagination-params";
import { AnswerComments } from "../../enterprise/entities/answer-comments";

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComments): Promise<void>;

  abstract findManyByAnswerId(
    questionId: string,
    params: PaginatinParams,
  ): Promise<AnswerComments[]>;

  abstract findById(id: string): Promise<AnswerComments | null>;
  abstract delete(answerComments: AnswerComments): Promise<void>;
}
