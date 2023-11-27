import { DomainEvents } from "@/core/events/domain-events";
import { PaginatinParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComments } from "@/domain/forum/enterprise/entities/question-comments";

export class InMemoryQuestionsCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComments[] = [];

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginatinParams,
  ): Promise<QuestionComments[]> {
    const questionsComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

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
