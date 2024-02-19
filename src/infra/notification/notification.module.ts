import { NotificationPublisher } from '@domain/notification/notification-publisher';
import { OnNotificationCreated } from '@domain/notification/subscribers/on-notification-created';
import { SendNotificationUseCase } from '@domain/notification/use-cases/send-notification';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { EnvService } from '../env/env.service';
import { NotificationEventEmitter } from './notification-event-emitter';
import { OneSignalNotificationPublisher } from './providers/one-sginal-notification-handler';
import { DeleteWebPushSubscription } from '@domain/subscriber/use-cases/delete-web-push-subscription';
import { TelegramNotificationHandler } from './providers/telegram-notification-handler';
import { WebPushNotificationHandler } from './providers/web-push-notification-handlers';

const DomainEventsHandlers = [OnNotificationCreated];

const NotificationProvidersHandlers = [
  OneSignalNotificationPublisher,
  TelegramNotificationHandler,
  WebPushNotificationHandler,
];

@Module({
  imports: [
    PrismaModule,
    HttpModule.registerAsync({
      useFactory: (env: EnvService) => ({
        baseURL: env.get('ONE_SIGNAL_SERVICE_ENDPOINT'),
        headers: {
          Authorization: `Basic ${env.get('ONE_SIGNAL_SERVICE_ENDPOINT')}`,
        },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [
    { provide: NotificationPublisher, useClass: NotificationEventEmitter },
    ...DomainEventsHandlers,
    ...NotificationProvidersHandlers,
    SendNotificationUseCase,
    NotificationEventEmitter,
    DeleteWebPushSubscription,
  ],
  exports: [SendNotificationUseCase],
})
export class NotificationModule {}
