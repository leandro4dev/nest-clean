import { AttachementRespository } from "@/domain/forum/application/repositories/attachment-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";

export class InMemoryAttachmentRepository implements AttachementRespository {
  public items: Attachment[] = [];

  async create(attachement: Attachment): Promise<void> {
    this.items.push(attachement);
  }
}
