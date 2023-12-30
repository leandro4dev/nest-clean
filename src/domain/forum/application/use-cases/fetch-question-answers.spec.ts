import { beforeEach, expect } from "vitest";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { FetchQuestionAnswerUseCase } from "./fetch-question-answers";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswerUseCase;

describe("Fetch Question Answers", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    sut = new FetchQuestionAnswerUseCase(inMemoryAnswersRepository); // system under test
  });

  it("should be able to fetch question answers", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    const answer1 = makeAnswer({
      questionId: new UniqueEntityID("question-1"),
      authorId: student.id,
    });

    const answer2 = makeAnswer({
      questionId: new UniqueEntityID("question-1"),
      authorId: student.id,
    });

    const answer3 = makeAnswer({
      questionId: new UniqueEntityID("question-1"),
      authorId: student.id,
    });

    await inMemoryAnswersRepository.create(answer1);
    await inMemoryAnswersRepository.create(answer2);
    await inMemoryAnswersRepository.create(answer3);

    const result = await sut.execute({
      page: 1,
      questionId: "question-1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toEqual([
      expect.objectContaining({
        author: "John Doe",
        answerId: answer1.id,
      }),
      expect.objectContaining({
        author: "John Doe",
        answerId: answer2.id,
      }),
      expect.objectContaining({
        author: "John Doe",
        answerId: answer3.id,
      }),
    ]);
  });

  it("should be able to fetch paginated questions answers", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID("question-1"),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: "question-1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toHaveLength(2);
  });
});
