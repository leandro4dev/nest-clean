import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { CommentsProps, Comment } from "./comments";
import { CommentAnswerEvent } from "../events/comment-answer-event";

export interface AnswerCommentsProps extends CommentsProps {
  answerId: UniqueEntityID;
}

export class AnswerComments extends Comment<AnswerCommentsProps> {
  get answerId() {
    return this.props.answerId;
  }

  static create(
    props: Optional<AnswerCommentsProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComments(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    const isNewComment = !id;

    if (isNewComment) {
      answerComment.addDomainEvent(new CommentAnswerEvent(answerComment));
    }

    return answerComment;
  }
}
