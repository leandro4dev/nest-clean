import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer-mapper";
import { Injectable } from "@nestjs/common";

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const question = Answer.create(
    {
      authorId: new UniqueEntityID("1"),
      questionId: new UniqueEntityID("1"),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data);

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    });

    return answer;
  }
}
