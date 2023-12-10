import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaAnswerAttachment {
  static toDomain(raw: PrismaAttachment) {
    if (!raw.answerId) {
      throw new Error("Invalid attachment type");
    }

    return AnswerAttachment.create({
      attachmentId: new UniqueEntityID(raw.id),
      answerId: new UniqueEntityID(raw.answerId),
    });
  }
}
