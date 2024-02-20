import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { InvalidNotificationOperation } from '../errors/invalid-notification-operation';
import { NotificationRepository } from '../notification.repository';
import { Notification } from '../notifications';
import { FindSubscriberByRecipientId } from '@domain/subscriber/use-cases/find-subscriber-by-recipient-id';
import { ResourceNotFound } from '@domain/subscriber/use-cases/errors/resource-not-found';

interface SendNotificationUseCaseProps {
  content: string;
  recipientId: string;
}

type SendNotificationUseCaseResponse = Either<
  InvalidNotificationOperation | ResourceNotFound,
  { notification: Notification }
>;

@Injectable()
export class SendNotificationUseCase
  implements UseCaseImplementation<SendNotificationUseCaseProps, SendNotificationUseCaseResponse>
{
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly findSubscriberByRecipientId: FindSubscriberByRecipientId,
  ) {}

  async execute({ content, recipientId }: SendNotificationUseCaseProps): Promise<SendNotificationUseCaseResponse> {
    const results = await this.findSubscriberByRecipientId.execute({ recipientId: recipientId });

    if (results.isLeft()) return left(results.value);

    const { subscriber } = results.value;

    const notification = Notification.create({
      content,
      recipientId: subscriber.id,
      createdAt: new Date(),
    });

    await this.notificationRepo.create(notification);

    return right({ notification });
  }
}
