import { Injectable } from '@nestjs/common';
import { NotificationEventEmitter } from '../notification-event-emitter';
import { EnvService } from '@app/infra/env/env.service';
import { HttpService } from '@nestjs/axios';
import { Notification } from '@domain/notification/notifications';
import { NotificationContentParsed } from './dto/notification-parsed.dto';

@Injectable()
export class OneSignalNotificationPublisher {
  constructor(
    private readonly notificationEventEmitter: NotificationEventEmitter,
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
  ) {
    this.notificationEventEmitter.subscriberToNotification({
      name: OneSignalNotificationPublisher.name,
      handle: this.publish.bind(this),
    });
  }

  public async publish(notification: Notification): Promise<void> {
    const { content, subscriber } = JSON.parse(notification.content) as NotificationContentParsed;

    this.httpService.post('notifications', {
      app_id: this.envService.get('ONE_SIGNAL_APP_ID'),
      include_aliases: {
        external_id: [subscriber.id],
      },
      contents: {
        en: content.message,
      },
      big_picture: content.imageUrl,
    });
  }
}
