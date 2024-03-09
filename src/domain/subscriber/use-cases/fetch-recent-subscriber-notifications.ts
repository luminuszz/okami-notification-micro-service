import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { ResourceNotFound } from './errors/resource-not-found';
import { Notification } from '@domain/notification/notifications';
import { Injectable } from '@nestjs/common';
import { SubscriberRepository } from './repositories/subscriber-repository';
import { NotificationRepository } from '@domain/notification/notification.repository';

interface FetchRecentSubscriberNotificationsProps {
  recipientId: string;
}

type FetchRecentSubscriberNotificationsOutput = Either<ResourceNotFound, { notifications: Notification[] }>;

@Injectable()
export class FetchRecentSubscriberNotifications
  implements UseCaseImplementation<FetchRecentSubscriberNotificationsProps, FetchRecentSubscriberNotificationsOutput>
{
  constructor(
    private readonly subscriberRepository: SubscriberRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({
    recipientId,
  }: FetchRecentSubscriberNotificationsProps): Promise<FetchRecentSubscriberNotificationsOutput> {
    const subscriber = await this.subscriberRepository.findByRecipientId(recipientId);

    if (!subscriber) {
      return left(new ResourceNotFound('Subscriber not found'));
    }

    const notifications = await this.notificationRepository.fetchRecentSubscriberNotifications(subscriber.id);

    return right({ notifications });
  }
}
