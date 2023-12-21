import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  QuestionCommentsProps,
  QuestionComments,
} from "@/domain/forum/enterprise/entities/question-comments";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaQuestionCommentsMapper } from "@/infra/database/prisma/mappers/prisma-question-comments-mapper";
import { Injectable } from "@nestjs/common";

export function makeQuestionComment(
  override: Partial<QuestionCommentsProps> = {},
  id?: UniqueEntityID,
) {
  const questionComments = QuestionComments.create(
    {
      authorId: override.authorId ?? new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return questionComments;
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentsProps> = {},
  ): Promise<QuestionComments> {
    const questionComment = makeQuestionComment(data);

    await this.prisma.comment.create({
      data: PrismaQuestionCommentsMapper.toPrisma(questionComment),
    });

    return questionComment;
  }
}
