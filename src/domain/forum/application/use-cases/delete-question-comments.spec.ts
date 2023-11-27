import { beforeEach } from "vitest";
import { InMemoryQuestionsCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "test/factories/make-quesion-comments";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comments", () => {
  beforeEach(() => {
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionsCommentsRepository); // system under test
  });

  it("should be able to delete a question comment", async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );

    await inMemoryQuestionsCommentsRepository.create(newQuestionComment);

    const result = await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: "author-1",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question comment", async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );

    await inMemoryQuestionsCommentsRepository.create(newQuestionComment);

    const result = await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
