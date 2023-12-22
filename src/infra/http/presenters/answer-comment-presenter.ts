import { AnswerComments } from "@/domain/forum/enterprise/entities/answer-comments";

export class AnswerCommentPresenter {
  static toHTTP(answerComment: AnswerComments) {
    return {
      id: answerComment.id.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    };
  }
}
