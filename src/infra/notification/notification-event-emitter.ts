import { NotificationPublisher, NotificationPublisherPayload } from '@domain/notification/notification-publisher';
import { Notification } from '@domain/notification/notifications';
import { Subscriber } from '@domain/subscriber/entities/subscriber';
import { Injectable } from '@nestjs/common';

export interface SubscriberHandler {
  name: string;
  handle: (notification: Notification, subscriber: Subscriber) => void;
}

@Injectable()
export class NotificationEventEmitter implements NotificationPublisher {
  private handlers: Map<string, SubscriberHandler> = new Map<string, SubscriberHandler>();

  public subscriberToNotification(callback: SubscriberHandler): void {
    const alreadySubscribed = this.handlers.get(callback.name);

    if (alreadySubscribed) return;

    this.handlers.set(callback.name, callback);
  }

  async publish({ notification, subscriber }: NotificationPublisherPayload) {
    this.handlers.forEach((subscriberHandler) => {
      subscriberHandler.handle(notification, subscriber);
    });
  }

  public async removeSubscriber(subscriberName: string): Promise<void> {
    this.handlers.delete(subscriberName);
  }
}
