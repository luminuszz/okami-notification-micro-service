import { EnvService } from '@app/infra/env/env.service';
import { NotificationPublisherPayload } from '@domain/notification/notification-publisher';
import { DeleteWebPushSubscription } from '@domain/subscriber/use-cases/delete-web-push-subscription';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as WebPush from 'web-push';
import { NotificationContentParsed } from './dto/notification-parsed.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { Channels } from '@domain/notification/notifications';

@Injectable()
export class WebPushNotificationHandler implements OnModuleInit {
  constructor(
    private readonly env: EnvService,
    private readonly deleteWebPushSubscription: DeleteWebPushSubscription,
  ) {}

  onModuleInit() {
    WebPush.setVapidDetails(
      'https://okami.daviribeiro.com',
      this.env.get('WEB_PUSH_PUBLIC_KEY'),
      this.env.get('WEB_PUSH_PRIVATE_KEY'),
    );
  }

  @OnEvent(['notification.created', `notification.created-in-channel-${Channels.TELEGRAM}`])
  async handleSubscription({ notification, subscriber }: NotificationPublisherPayload) {
    const content = JSON.parse(notification.content) as NotificationContentParsed;

    if (!subscriber.webPushSubscriptions?.length) return;

    const { webPushSubscriptions } = subscriber;

    for (const subscription of webPushSubscriptions) {
      console.log('Sending web push notification', { subscription, content });
      try {
        await WebPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.webPushSubscriptionAuth,
              p256dh: subscription.webPushSubscriptionP256dh,
            },
          },
          content.message,
        );
      } catch (error) {
        if (error instanceof WebPush.WebPushError) {
          if (error.statusCode === 410) {
            await this.deleteWebPushSubscription.execute({
              webPushSubscriptionId: subscription.id,
            });
          }
        }
      }
    }
  }
}
