import { NotificationPublisher } from '@domain/notification/notification-publisher';
import { OnNotificationCreated } from '@domain/notification/subscribers/on-notification-created';
import { SendNotificationUseCase } from '@domain/notification/use-cases/send-notification';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { EnvService } from '../env/env.service';
import { NotificationEventEmitter } from './notification-event-emitter';
import { OneSignalNotificationPublisher } from './handlers/one-sginal-notification-handler';
import { DeleteWebPushSubscription } from '@domain/subscriber/use-cases/delete-web-push-subscription';
import { TelegramNotificationHandler } from './handlers/telegram-notification-handler';
import { WebPushNotificationHandler } from './handlers/web-push-notification-handlers';
import { FindSubscriberByRecipientId } from '@domain/subscriber/use-cases/find-subscriber-by-recipient-id';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TelegrafProvider } from './providers/telegraf.provider';
import { UpdateSubscriberTelegramChatId } from '@domain/subscriber/use-cases/update-subscriber-telegram-chat-id';
import { FindSubscriberByEmail } from '@domain/subscriber/use-cases/find-subscriber-by-email';
import { MailModule } from '../mail/mail.module';
import { SendAuthCodeEmail } from '@domain/subscriber/use-cases/send-auth-code-mail';
import { CompareSubscriberAuthCode } from '@domain/subscriber/use-cases/compare-subscriber-auth-code';

const DomainEventsHandlers = [OnNotificationCreated];

const NotificationProvidersHandlers = [
  OneSignalNotificationPublisher,
  TelegramNotificationHandler,
  WebPushNotificationHandler,
];

@Module({
  imports: [
    MailModule,
    EventEmitterModule.forRoot(),
    PrismaModule,
    HttpModule.registerAsync({
      useFactory: (env: EnvService) => ({
        baseURL: env.get('ONE_SIGNAL_SERVICE_ENDPOINT'),
        headers: {
          Authorization: `Basic ${env.get('ONE_SIGNAL_API_TOKEN')}`,
        },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [
    TelegrafProvider,
    NotificationEventEmitter,
    UpdateSubscriberTelegramChatId,
    { provide: NotificationPublisher, useClass: NotificationEventEmitter },
    ...DomainEventsHandlers,
    ...NotificationProvidersHandlers,
    SendNotificationUseCase,
    DeleteWebPushSubscription,
    FindSubscriberByEmail,
    SendAuthCodeEmail,
    CompareSubscriberAuthCode,
    FindSubscriberByRecipientId,
  ],
  exports: [SendNotificationUseCase, TelegrafProvider],
})
export class NotificationModule {}
