import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment) {
    if (!raw.answerId) {
      throw new Error("Invalid attachment type");
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        answerId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaUpdateMany(
    attachment: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachment.map((attachment) => {
      return attachment.attachmentId.toString();
    });

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        answerId: attachment[0].answerId.toString(),
      },
    };
  }
}
