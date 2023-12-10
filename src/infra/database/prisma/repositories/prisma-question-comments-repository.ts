import { PaginatinParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComments } from "@/domain/forum/enterprise/entities/question-comments";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentsMapper } from "../mappers/prisma-question-comments-mapper";

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComments | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!questionComment) {
      return null;
    }

    return PrismaQuestionCommentsMapper.toDomain(questionComment);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginatinParams,
  ): Promise<QuestionComments[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questionComments.map(PrismaQuestionCommentsMapper.toDomain);
  }

  async create(questionComment: QuestionComments): Promise<void> {
    const data = PrismaQuestionCommentsMapper.toPrisma(questionComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(questionComments: QuestionComments): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComments.id.toString(),
      },
    });
  }
}
