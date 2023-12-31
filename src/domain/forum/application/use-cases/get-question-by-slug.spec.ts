import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { makeQuestion } from "test/factories/make-question";
import { beforeEach } from "vitest";
import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";
import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestionAttachments } from "test/factories/make-question-attachments";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();

    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();

    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentsRepository,
    );

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository); // system under test
  });

  it("should be able to get a question by slug", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    const newQuestion = makeQuestion({
      slug: Slug.create("example-question"),
      authorId: student.id,
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const attachment = makeAttachment({
      title: "Some attachment",
    });

    inMemoryAttachmentRepository.items.push(attachment);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachments({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    );

    const result = await sut.execute({
      slug: "example-question",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value).toMatchObject({
        question: expect.objectContaining({
          title: newQuestion.title,
          author: "John Doe",
          attachments: [
            expect.objectContaining({
              title: "Some attachment",
            }),
          ],
        }),
      });
    }
  });
});
