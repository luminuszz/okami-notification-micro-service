import { EnvService } from '@app/infra/env/env.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as WebPush from 'web-push';
import { NotificationEventEmitter } from '../notification-event-emitter';
import { NotificationContentParsed } from './dto/notification-parsed.dto';
import { Notification } from '@domain/notification/notifications';
import { DeleteWebPushSubscription } from '@domain/subscriber/use-cases/delete-web-push-subscription';

@Injectable()
export class WebPushNotificationHandler implements OnModuleInit {
  constructor(
    private readonly env: EnvService,
    private notificationEmitter: NotificationEventEmitter,
    private readonly deleteWebPushSubscription: DeleteWebPushSubscription,
  ) {
    this.notificationEmitter.subscriberToNotification({
      handle: this.handleSubscription.bind(this),
      name: WebPushNotificationHandler.name,
    });
  }

  onModuleInit() {
    WebPush.setVapidDetails(
      'https://okami.daviribeiro.com',
      this.env.get('WEB_PUSH_PUBLIC_KEY'),
      this.env.get('WEB_PUSH_PRIVATE_KEY'),
    );
  }

  async handleSubscription(notification: Notification) {
    const { content, subscriber } = JSON.parse(notification.content) as NotificationContentParsed;

    if (!subscriber.webPushSubscriptions?.length) return;

    const { webPushSubscriptions } = subscriber;

    for (const subscription of webPushSubscriptions) {
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
