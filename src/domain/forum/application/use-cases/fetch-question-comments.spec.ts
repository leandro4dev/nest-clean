import { beforeEach, expect } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionsCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { makeQuestionComment } from "test/factories/make-question-comments";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository(inMemoryStudentsRepository);

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionsCommentsRepository); // system under test
  });

  it("should be able to fetch question comments", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      content: "Conteudo do comentario 1",
      authorId: student.id,
    });

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      content: "Conteudo do comentario 2",
      authorId: student.id,
    });

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      content: "Conteudo do comentario 3",
      authorId: student.id,
    });

    await inMemoryQuestionsCommentsRepository.create(comment1);

    await inMemoryQuestionsCommentsRepository.create(comment2);

    await inMemoryQuestionsCommentsRepository.create(comment3);

    const result = await sut.execute({
      questionId: "question-1",
      page: 1,
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
      await inMemoryQuestionsCommentsRepository.create(
        makeQuestionComment({
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
    expect(result.value?.comments).toHaveLength(2);
  });
});
