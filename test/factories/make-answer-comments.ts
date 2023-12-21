import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  AnswerComments,
  AnswerCommentsProps,
} from "@/domain/forum/enterprise/entities/answer-comments";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAnswerCommentsMapper } from "@/infra/database/prisma/mappers/prisma-answer-comments-mapper";
import { Injectable } from "@nestjs/common";

export function makeAnswerComment(
  override: Partial<AnswerCommentsProps> = {},
  id?: UniqueEntityID,
) {
  const answerComments = AnswerComments.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answerComments;
}

@Injectable()
export class AnswerCommentsFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerComments> = {},
  ): Promise<AnswerComments> {
    const answerComments = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentsMapper.toPrisma(answerComments),
    });

    return answerComments;
  }
}
