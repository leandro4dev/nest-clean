import { DomainEvents } from "@/core/events/domain-events";
import { PaginatinParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/answer-with-author";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentRepository: AnswerAttachmentsRepository,
    private studentRepostory: InMemoryStudentsRepository,
  ) {}

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginatinParams,
  ): Promise<AnswerWithAuthor[]> {
    const questionAnswers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((answer) => {
        const author = this.studentRepostory.items.find((student) => {
          return student.id.equals(answer.authorId);
        });

        if (!author) {
          throw new Error(
            `Author with Id ${answer.authorId.toString()} does not exist`,
          );
        }

        return AnswerWithAuthor.create({
          answerId: answer.id,
          content: answer.content,
          authorId: answer.authorId,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
          author: author.name,
        });
      });

    return questionAnswers;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginatinParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async create(answer: Answer) {
    this.items.push(answer);

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(itemIndex, 1);

    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[itemIndex] = answer;

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getNewItems(),
    );

    await this.answerAttachmentRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
