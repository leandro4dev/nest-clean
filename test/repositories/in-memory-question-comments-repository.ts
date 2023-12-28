import { DomainEvents } from "@/core/events/domain-events";
import { PaginatinParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComments } from "@/domain/forum/enterprise/entities/question-comments";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryQuestionsCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComments[] = [];

  constructor(private studentRepostory: InMemoryStudentsRepository) {}

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginatinParams,
  ): Promise<QuestionComments[]> {
    const questionsComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionsComments;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginatinParams,
  ): Promise<CommentWithAuthor[]> {
    const questionsComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentRepostory.items.find((student) => {
          return student.id.equals(comment.authorId);
        });

        if (!author) {
          throw new Error(
            `Author with Id ${comment.authorId.toString()} does not exist`,
          );
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: author.name,
        });
      });

    return questionsComments;
  }

  async findById(id: string): Promise<QuestionComments | null> {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }

  async delete(questionComments: QuestionComments): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComments.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async create(questionComment: QuestionComments) {
    this.items.push(questionComment);

    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }
}
