import { beforeEach, expect } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionsCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { makeQuestionComment } from "test/factories/make-quesion-comments";

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments", () => {
  beforeEach(() => {
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionsCommentsRepository); // system under test
  });

  it("should be able to fetch question comments", async () => {
    await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID("question-1"),
        content: "Conteudo do comentario 1",
      }),
    );

    await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID("question-1"),
        content: "Conteudo do comentario 2",
      }),
    );

    await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID("question-1"),
        content: "Conteudo do comentario 3",
      }),
    );

    const result = await sut.execute({
      page: 1,
      questionId: "question-1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questionComments).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityID("question-1"),
        content: "Conteudo do comentario 1",
      }),
      expect.objectContaining({
        questionId: new UniqueEntityID("question-1"),
        content: "Conteudo do comentario 2",
      }),
      expect.objectContaining({
        questionId: new UniqueEntityID("question-1"),
        content: "Conteudo do comentario 3",
      }),
    ]);
  });

  it("should be able to fetch paginated questions answers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question-1"),
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: "question-1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questionComments).toHaveLength(2);
  });
});
