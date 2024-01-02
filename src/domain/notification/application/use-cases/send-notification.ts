import { Either, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRepository } from "../repositories/notifications-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

export interface SendNotificationRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationRequest): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    });

    await this.notificationRepository.create(notification);

    return right({
      notification,
    });
  }
}
