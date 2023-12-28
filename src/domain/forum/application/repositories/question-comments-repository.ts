import { PaginatinParams } from "@/core/repositories/pagination-params";
import { QuestionComments } from "../../enterprise/entities/question-comments";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComments | null>;

  abstract findManyByQuestionId(
    questionId: string,
    params: PaginatinParams,
  ): Promise<QuestionComments[]>;

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginatinParams,
  ): Promise<CommentWithAuthor[]>;

  abstract create(questionComment: QuestionComments): Promise<void>;
  abstract delete(questionComments: QuestionComments): Promise<void>;
}
