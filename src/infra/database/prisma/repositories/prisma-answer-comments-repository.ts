import { PaginatinParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComments } from "@/domain/forum/enterprise/entities/answer-comments";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentsMapper } from "../mappers/prisma-answer-comments-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComments | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!answerComment) {
      return null;
    }

    return PrismaAnswerCommentsMapper.toDomain(answerComment);
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginatinParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return comments.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginatinParams,
  ): Promise<AnswerComments[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answerComments.map(PrismaAnswerCommentsMapper.toDomain);
  }

  async create(answerComment: AnswerComments): Promise<void> {
    const data = PrismaAnswerCommentsMapper.toPrisma(answerComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(answerComments: AnswerComments): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComments.id.toString(),
      },
    });
  }
}
