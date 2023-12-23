import { Either, left, right } from "@/core/either";
import { InvalidAttachmentType } from "./errors/invalid-attachment-type";
import { Attachment } from "../../enterprise/entities/attachment";
import { AttachementRespository } from "../repositories/attachment-repository";
import { Uploader } from "../storage/uploader";

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentType,
  { attachment: Attachment }
>;

export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentRepository: AttachementRespository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png|webp)|application\/(pdf))$/.test(fileType)) {
      return left(new InvalidAttachmentType(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentRepository.create(attachment);

    return right({ attachment });
  }
}
