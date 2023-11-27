import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";

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
