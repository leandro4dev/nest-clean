import { QuestionAttachment } from "../../enterprise/entities/question-attachment";

export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>;

  abstract deleteManyByQuestionId(questionId: string): Promise<void>;

  abstract createMany(attachment: QuestionAttachment[]): Promise<void>;
  abstract deleteMany(attachment: QuestionAttachment[]): Promise<void>;
}
