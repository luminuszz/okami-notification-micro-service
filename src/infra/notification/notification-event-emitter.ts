import { NotificationPublisher, NotificationPublisherPayload } from '@domain/notification/notification-publisher';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationEventEmitter implements NotificationPublisher {
  constructor(private eventEmitter: EventEmitter2) {}

  async publish({ notification, subscriber }: NotificationPublisherPayload) {
    console.log('Publishing notification', notification, 'to', subscriber);

    const needNotifyAll = notification?.channels?.includes('all');

    if (needNotifyAll) {
      this.eventEmitter.emit(`notification.created`, { notification, subscriber });
    } else {
      notification.channels?.forEach((channel) => {
        this.eventEmitter.emit(`notification.created-in-channel-${channel}`, { notification, subscriber });
      });
    }
  }
}
