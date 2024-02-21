import { EnvService } from '@app/infra/env/env.service';
import { NotificationPublisherPayload } from '@domain/notification/notification-publisher';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEventEmitter } from '../notification-event-emitter';
import { NotificationContentParsed } from './dto/notification-parsed.dto';
import { map } from 'lodash';

@Injectable()
export class OneSignalNotificationPublisher {
  constructor(
    private readonly notificationEventEmitter: NotificationEventEmitter,
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
  ) {}

  private logger = new Logger(OneSignalNotificationPublisher.name);

  @OnEvent('notification.created')
  public async publish({ notification, subscriber }: NotificationPublisherPayload): Promise<void> {
    const content = JSON.parse(notification.content) as NotificationContentParsed;

    if (!subscriber.mobilePushSubscriptions?.length) return;

    const subscribersTokens = map(subscriber.mobilePushSubscriptions, 'subscriptionToken');

    this.logger.log(`Sending notification to ${subscribersTokens.join(', ')}`);

    this.httpService.post('notifications', {
      app_id: this.envService.get('ONE_SIGNAL_APP_ID'),
      include_subscription_ids: subscribersTokens,
      contents: {
        en: content.message,
      },
      big_picture: content.imageUrl,
    });
  }
}
