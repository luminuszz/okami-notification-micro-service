import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { InvalidNotificationOperation } from '../errors/invalid-notification-operation';
import { Notification } from '../notifications';
import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../notification.repository';
import { NotificationPublisher } from '../notification-publisher';

interface SendNotificationUseCaseProps {
  content: string;
  recipientId: string;
}

type SendNotificationUseCaseResponse = Either<InvalidNotificationOperation, { notification: Notification }>;

@Injectable()
export class SendNotificationUseCase
  implements UseCaseImplementation<SendNotificationUseCaseProps, SendNotificationUseCaseResponse>
{
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly notificationPublisher: NotificationPublisher,
  ) {}

  async execute({ content, recipientId }: SendNotificationUseCaseProps): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      content,
      recipientId,
      createdAt: new Date(),
    });

    await this.notificationRepo.create(notification);

    await this.notificationPublisher.publish(notification);

    return right({ notification });
  }
}
