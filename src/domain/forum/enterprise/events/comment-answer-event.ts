import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { AnswerComments } from "../entities/answer-comments";

export class CommentAnswerEvent implements DomainEvent {
  public ocurredAt: Date;
  public answerComments: AnswerComments;

  constructor(answerComments: AnswerComments) {
    this.answerComments = answerComments;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComments.id;
  }
}
