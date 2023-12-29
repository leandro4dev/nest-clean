import { DomainEvents } from "@/core/events/domain-events";
import { PaginatinParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComments } from "@/domain/forum/enterprise/entities/answer-comments";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryAnswersCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComments[] = [];

  constructor(private studentRepostory: InMemoryStudentsRepository) {}

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginatinParams,
  ): Promise<AnswerComments[]> {
    const questionsComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return questionsComments;
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginatinParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
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

    return answerComments;
  }

  async findById(id: string): Promise<AnswerComments | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    if (!answerComment) {
      return null;
    }

    return answerComment;
  }

  async delete(answerComments: AnswerComments): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComments.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async create(answerComment: AnswerComments) {
    this.items.push(answerComment);

    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }
}
