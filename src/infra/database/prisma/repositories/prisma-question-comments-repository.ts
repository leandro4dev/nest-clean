import { PaginatinParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComments } from "@/domain/forum/enterprise/entities/question-comments";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  findById(id: string): Promise<QuestionComments | null> {
    throw new Error("Method not implemented.");
  }

  findManyByQuestionId(
    questionId: string,
    params: PaginatinParams,
  ): Promise<QuestionComments[]> {
    throw new Error("Method not implemented.");
  }

  create(questionComment: QuestionComments): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(questionComments: QuestionComments): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
