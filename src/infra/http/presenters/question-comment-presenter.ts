import { QuestionComments } from "@/domain/forum/enterprise/entities/question-comments";

export class QuestionCommentPresenter {
  static toHTTP(questionComment: QuestionComments) {
    return {
      id: questionComment.id.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    };
  }
}
