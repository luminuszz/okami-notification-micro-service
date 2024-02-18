import { DomainEventHandler } from '@core/domain-events/domain-event-handler';
import { NotificationCreated } from '@domain/notification/events/notification-created';
import { Injectable } from '@nestjs/common';
import { SubscriberRepository } from '../../subscriber/use-cases/repositories/subscriber-repository';
import { NotificationPublisher } from '@domain/notification/notification-publisher';
import { DomainEvents } from '@core/domain-events/domain-events';

@Injectable()
export class OnNotificationCreated implements DomainEventHandler<NotificationCreated> {
  constructor(
    private readonly subscriberRepository: SubscriberRepository,
    private readonly notificationPublisher: NotificationPublisher,
  ) {
    this.setupSubscriptions();
  }
  setupSubscriptions(): void {
    DomainEvents.register(this.handle.bind(this), NotificationCreated.name);
  }

  async handle({ notification }: NotificationCreated): Promise<void> {
    const subscriber = await this.subscriberRepository.getSubscriptions(notification.recipientId);

    if (subscriber) {
      this.notificationPublisher.publish({
        notification,
        subscriber,
      });
    }
  }
}
