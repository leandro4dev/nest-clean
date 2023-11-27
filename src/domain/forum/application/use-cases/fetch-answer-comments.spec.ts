import { beforeEach, expect } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { InMemoryAnswersCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comments";

let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswersCommentsRepository); // system under test
  });

  it("should be able to fetch answer comments", async () => {
    await inMemoryAnswersCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
        content: "Conteudo do comentario 1",
      }),
    );

    await inMemoryAnswersCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
        content: "Conteudo do comentario 2",
      }),
    );

    await inMemoryAnswersCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
        content: "Conteudo do comentario 3",
      }),
    );

    const result = await sut.execute({
      page: 1,
      answerId: "answer-1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answersComments).toEqual([
      expect.objectContaining({
        answerId: new UniqueEntityID("answer-1"),
        content: "Conteudo do comentario 1",
      }),
      expect.objectContaining({
        answerId: new UniqueEntityID("answer-1"),
        content: "Conteudo do comentario 2",
      }),
      expect.objectContaining({
        answerId: new UniqueEntityID("answer-1"),
        content: "Conteudo do comentario 3",
      }),
    ]);
  });

  it("should be able to fetch paginated questions answers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      answerId: "answer-1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answersComments).toHaveLength(2);
  });
});
