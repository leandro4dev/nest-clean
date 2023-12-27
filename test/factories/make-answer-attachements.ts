import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  AnswerAttachmentProps,
  AnswerAttachment,
} from "@/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeAnswerAttachments(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const answerAttachments = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return answerAttachments;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaanswerAttachment(
    data: Partial<AnswerAttachment> = {},
  ): Promise<AnswerAttachmentProps> {
    const answerAttachment = makeAnswerAttachments(data);

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    });

    return answerAttachment;
  }
}
