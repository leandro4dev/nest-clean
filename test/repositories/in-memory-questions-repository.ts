import { DomainEvents } from "@/core/events/domain-events";
import { PaginatinParams } from "@/core/repositories/pagination-params";
import { QuestionsRespository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { InMemoryAttachmentRepository } from "./in-memory-attachment-repository";
import { InMemoryQuestionsAttachmentsRepository } from "./in-memory-question-attachments-repository";

export class InMemoryQuestionsRepository implements QuestionsRespository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentRepository: InMemoryQuestionsAttachmentsRepository,
    private attachmentRepository: InMemoryAttachmentRepository,
    private studentRepository: InMemoryStudentsRepository,
  ) {}

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    const author = this.studentRepository.items.find((student) => {
      return student.id.equals(question.authorId);
    });

    if (!author) {
      throw new Error(
        `Author with ID ${question.authorId.toString()} does not exist`,
      );
    }

    const questionAttachments = this.questionAttachmentRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id);
      },
    );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId);
      });

      if (!attachment) {
        throw new Error(
          `Attachment with ID ${questionAttachment.attachmentId.toString()} does not exist`,
        );
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
  }

  async findManyRecent({ page }: PaginatinParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async create(question: Question) {
    this.items.push(question);

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(itemIndex, 1);

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    );

    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
