import { Either } from "@/core/either";
import { InvalidAttachmentType } from "./errors/invalid-attachment-type";
import { Attachment } from "../../enterprise/entities/attachment";

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  filetype: string;
  body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentType,
  { attachment: Attachment }
>;

export class UploadAndCreateAttachment {
  async execute() {}
}
