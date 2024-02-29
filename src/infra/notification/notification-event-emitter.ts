import { NotificationPublisher, NotificationPublisherPayload } from '@domain/notification/notification-publisher';
import { Providers } from '@domain/notification/notifications';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { flatMap, map, values } from 'lodash';
import { createChannelSubscriber } from './handlers/utils';

@Injectable()
export class NotificationEventEmitter implements NotificationPublisher {
  constructor(private eventEmitter: EventEmitter2) {}

  async publish({ notification, subscriber }: NotificationPublisherPayload) {
    console.log('Publishing notification', notification.channels?.join(','), 'to', subscriber.channels?.join(','));

    if (!notification.providers?.length || !notification.channels?.length) return;

    let events: string[] = [];

    const needToNotifyAllProviders = notification.providers.includes('all');

    if (needToNotifyAllProviders) {
      events = values(Providers).flatMap((provider) => {
        return map(notification.channels, (channel) => {
          return createChannelSubscriber(channel, provider);
        });
      });
    } else {
      events = flatMap(notification.providers, (provider) => {
        return map(notification.channels, (channel) => {
          return createChannelSubscriber(channel, provider);
        });
      });
    }

    console.log({ events });

    events.forEach((event) => {
      this.eventEmitter.emit(event, { notification, subscriber });
    });
  }
}
