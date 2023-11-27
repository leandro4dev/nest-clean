import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { CommentAnswerEvent } from "../../enterprise/events/comment-answer-event";
import { DomainEvents } from "@/core/events/domain-events";
import { AnswersRepository } from "../repositories/answers-repository";

export class OnCommentAnswer implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendCommentAnswerNotification.bind(this),
      CommentAnswerEvent.name,
    );
  }

  private async sendCommentAnswerNotification({
    answerComments,
  }: CommentAnswerEvent) {
    const answer = await this.answerRepository.findById(
      answerComments.answerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer?.authorId.toString(),
        title: "Novo comentario em uma das suas respostas",
        content: answer.excerpt,
      });
    }
  }
}
