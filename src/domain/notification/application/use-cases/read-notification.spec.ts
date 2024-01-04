import { InMemoryNotificationRepository } from "test/repositories/in-memory-notifications-repository";
import { ReadNotificationUseCase } from "./read-notification";
import { makeNotification } from "test/factories/make-notification";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe("Read Notificaiton", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository);
  });

  it("should be able to read notification", async () => {
    const newNotification = makeNotification();

    await inMemoryNotificationRepository.create(newNotification);

    const result = await sut.execute({
      recipientId: "1",
      notificationId: newNotification.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(inMemoryNotificationRepository.items[0]).toEqual(
        result.value.notification,
      );
    }
  });
});
