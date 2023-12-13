import { PaginatinParams } from "@/core/repositories/pagination-params";
import { QuestionComments } from "../../enterprise/entities/question-comments";

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComments | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginatinParams,
  ): Promise<QuestionComments[]>;

  abstract create(questionComment: QuestionComments): Promise<void>;
  abstract delete(questionComments: QuestionComments): Promise<void>;
}
