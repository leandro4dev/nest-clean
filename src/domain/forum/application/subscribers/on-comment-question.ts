import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { CommentQuestionEvent } from "../../enterprise/events/comment-question-event";
import { QuestionsRespository } from "../repositories/question-repository";

export class OnCommentQuestion implements EventHandler {
  constructor(
    private questionRepository: QuestionsRespository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendCommentQuestionNotification.bind(this),
      CommentQuestionEvent.name,
    );
  }

  private async sendCommentQuestionNotification({
    questionComments,
  }: CommentQuestionEvent) {
    const question = await this.questionRepository.findById(
      questionComments.questionId.toString(),
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question?.authorId.toString(),
        title: "Novo comentario em uma das suas Perguntas",
        content: question.excerpt,
      });
    }
  }
}
