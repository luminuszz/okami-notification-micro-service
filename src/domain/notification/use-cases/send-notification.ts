import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { InvalidNotificationOperation } from '../errors/invalid-notification-operation';
import { NotificationRepository } from '../notification.repository';
import { Notification } from '../notifications';

interface SendNotificationUseCaseProps {
  content: string;
  recipientId: string;
}

type SendNotificationUseCaseResponse = Either<InvalidNotificationOperation, { notification: Notification }>;

@Injectable()
export class SendNotificationUseCase
  implements UseCaseImplementation<SendNotificationUseCaseProps, SendNotificationUseCaseResponse>
{
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute({ content, recipientId }: SendNotificationUseCaseProps): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      content,
      recipientId,
      createdAt: new Date(),
    });

    await this.notificationRepo.create(notification);

    return right({ notification });
  }
}
