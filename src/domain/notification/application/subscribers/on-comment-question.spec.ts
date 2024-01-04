import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import {
  SendNotificationRequest,
  SendNotificationResponse,
  SendNotificationUseCase,
} from "@/domain/notification/application/use-cases/send-notification";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notifications-repository";
import { makeQuestion } from "test/factories/make-question";
import { SpyInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { makeQuestionComment } from "test/factories/make-question-comments";
import { InMemoryQuestionsCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { OnCommentQuestion } from "./on-comment-question";
import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryStudentRepository: InMemoryStudentsRepository;
let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationRequest],
  Promise<SendNotificationResponse>
>;

describe("On Comment Question", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository();

    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();

    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentRepository,
    );

    inMemoryNotificationRepository = new InMemoryNotificationRepository();

    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository(inMemoryStudentRepository);

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnCommentQuestion(inMemoryQuestionRepository, sendNotificationUseCase);
  });

  it("should send a notification when comment on question", async () => {
    const question = makeQuestion();

    const questionComment = makeQuestionComment({
      questionId: question.id,
    });

    await inMemoryQuestionRepository.create(question);
    await inMemoryQuestionsCommentsRepository.create(questionComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
