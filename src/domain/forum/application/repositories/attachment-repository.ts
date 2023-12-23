import { Attachment } from "../../enterprise/entities/attachment";

export abstract class AttachementRespository {
  abstract create(attachement: Attachment): Promise<void>;
}
