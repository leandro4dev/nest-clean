import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionsAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );

    return questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );

    this.items = questionAttachments;
  }

  async createMany(attachment: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachment);
  }

  async deleteMany(attachment: QuestionAttachment[]): Promise<void> {
    const questionAttachment = this.items.filter((item) => {
      return !attachment.some((attachment) => attachment.equals(item));
    });

    this.items = questionAttachment;
  }
}
