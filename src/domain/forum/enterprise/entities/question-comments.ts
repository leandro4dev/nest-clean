import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { CommentsProps, Comment } from "./comments";
import { CommentQuestionEvent } from "../events/comment-question-event";

export interface QuestionCommentsProps extends CommentsProps {
  questionId: UniqueEntityID;
}

export class QuestionComments extends Comment<QuestionCommentsProps> {
  get questionId() {
    return this.props.questionId;
  }

  static create(
    props: Optional<QuestionCommentsProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComments(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    const isNewComment = !id;

    if (isNewComment) {
      questionComment.addDomainEvent(new CommentQuestionEvent(questionComment));
    }

    return questionComment;
  }
}
