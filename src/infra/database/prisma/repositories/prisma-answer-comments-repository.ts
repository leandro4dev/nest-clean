import { PaginatinParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComments } from "@/domain/forum/enterprise/entities/answer-comments";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  create(answerComment: AnswerComments): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findManyByAnswerId(
    questionId: string,
    params: PaginatinParams,
  ): Promise<AnswerComments[]> {
    throw new Error("Method not implemented.");
  }

  findById(id: string): Promise<AnswerComments | null> {
    throw new Error("Method not implemented.");
  }

  delete(answerComments: AnswerComments): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
