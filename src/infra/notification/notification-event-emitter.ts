import { NotificationPublisher, NotificationPublisherPayload } from '@domain/notification/notification-publisher';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationEventEmitter implements NotificationPublisher {
  constructor(private eventEmitter: EventEmitter2) {}

  async publish({ notification, subscriber }: NotificationPublisherPayload) {
    console.log('Publishing notification', notification, 'to', subscriber);
    this.eventEmitter.emit('notification.created', { notification, subscriber });
  }
}
