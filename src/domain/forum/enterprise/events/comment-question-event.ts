import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { QuestionComments } from "../entities/question-comments";

export class CommentQuestionEvent implements DomainEvent {
  public ocurredAt: Date;
  public questionComments: QuestionComments;

  constructor(questionComments: QuestionComments) {
    this.questionComments = questionComments;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.questionComments.id;
  }
}
