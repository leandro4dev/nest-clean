import { beforeEach, expect } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { InMemoryAnswersCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comments";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository(
      inMemoryStudentsRepository,
    );

    sut = new FetchAnswerCommentsUseCase(inMemoryAnswersCommentsRepository); // system under test
  });

  it("should be able to fetch answer comments", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      content: "Conteudo do comentario 1",
      authorId: student.id,
    });

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      content: "Conteudo do comentario 2",
      authorId: student.id,
    });

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      content: "Conteudo do comentario 3",
      authorId: student.id,
    });

    await inMemoryAnswersCommentsRepository.create(comment1);
    await inMemoryAnswersCommentsRepository.create(comment2);
    await inMemoryAnswersCommentsRepository.create(comment3);

    const result = await sut.execute({
      page: 1,
      answerId: "answer-1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: comment1.id,
          content: "Conteudo do comentario 1",
          author: "John Doe",
        }),
        expect.objectContaining({
          commentId: comment2.id,
          content: "Conteudo do comentario 2",
          author: "John Doe",
        }),
        expect.objectContaining({
          commentId: comment3.id,
          content: "Conteudo do comentario 3",
          author: "John Doe",
        }),
      ]),
    );
  });

  it("should be able to fetch paginated questions answers", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      answerId: "answer-1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });
});
