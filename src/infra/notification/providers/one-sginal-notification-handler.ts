import { EnvService } from '@app/infra/env/env.service';
import { NotificationPublisherPayload } from '@domain/notification/notification-publisher';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEventEmitter } from '../notification-event-emitter';
import { NotificationContentParsed } from './dto/notification-parsed.dto';

@Injectable()
export class OneSignalNotificationPublisher {
  constructor(
    private readonly notificationEventEmitter: NotificationEventEmitter,
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
  ) {}

  @OnEvent('notification.created')
  public async publish({ notification, subscriber }: NotificationPublisherPayload): Promise<void> {
    const content = JSON.parse(notification.content) as NotificationContentParsed;

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
