import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidAttachmentType } from "./errors/invalid-attachment-type";

let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let sut: UploadAndCreateAttachmentUseCase;
let fakeUploader: FakeUploader;

describe("Upload And Create Attachment", () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    fakeUploader = new FakeUploader();

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      fakeUploader,
    );
  });

  it("should be able upload and create an attachement", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      }),
    );
  });

  it("should not be able to upload an attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentType);
  });
});
