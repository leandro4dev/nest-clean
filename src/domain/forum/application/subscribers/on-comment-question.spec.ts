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
import { makeQuestionComment } from "test/factories/make-quesion-comments";
import { InMemoryQuestionsCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { OnCommentQuestion } from "./on-comment-question";

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
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();

    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    inMemoryNotificationRepository = new InMemoryNotificationRepository();

    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository();

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
