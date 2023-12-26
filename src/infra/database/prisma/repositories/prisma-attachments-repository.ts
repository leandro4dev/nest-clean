import { AttachementRespository } from "@/domain/forum/application/repositories/attachment-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { PrismaService } from "../prisma.service";
import { PrismaAttachmentMapper } from "../mappers/prisma-attachment-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAttachmentRepository implements AttachementRespository {
  constructor(private prisma: PrismaService) {}

  async create(attachement: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachement);

    await this.prisma.attachment.create({
      data,
    });
  }
}
