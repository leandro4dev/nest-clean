import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { Injectable } from "@nestjs/common";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerEvent } from "@/domain/forum/enterprise/events/question-best-answer-choose-event";

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendBestAnswerNoticiation.bind(this),
      QuestionBestAnswerEvent.name,
    );
  }

  private async sendBestAnswerNoticiation({
    question,
    bestAnswerId,
  }: QuestionBestAnswerEvent) {
    const answer = await this.answerRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que voce enviou em "${question.title
          .substring(0, 20)
          .concat("...")}" foi escolhida a melhor resposta pelo autor!`,
      });
    }
  }
}
