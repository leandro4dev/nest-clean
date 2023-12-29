import { PaginatinParams } from "@/core/repositories/pagination-params";
import { AnswerComments } from "../../enterprise/entities/answer-comments";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComments): Promise<void>;

  abstract findManyByAnswerId(
    answerId: string,
    params: PaginatinParams,
  ): Promise<AnswerComments[]>;

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginatinParams,
  ): Promise<CommentWithAuthor[]>;

  abstract findById(id: string): Promise<AnswerComments | null>;
  abstract delete(answerComments: AnswerComments): Promise<void>;
}
