import { NotificationPublisher } from '@domain/notification/notification-publisher';
import { OnNotificationCreated } from '@domain/notification/subscribers/on-notification-created';
import { SendNotificationUseCase } from '@domain/notification/use-cases/send-notification';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { EnvService } from '../env/env.service';
import { NotificationEventEmitter } from './notification-event-emitter';
import { OneSignalNotificationPublisher } from './providers/one-sginal-notification-handler';

const DomainEventsHandlers = [OnNotificationCreated];

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
    ...DomainEventsHandlers,
    SendNotificationUseCase,
    NotificationEventEmitter,
    { provide: NotificationPublisher, useClass: NotificationEventEmitter },
    {
      provide: NotificationPublisher,
      useClass: NotificationEventEmitter,
    },
    OneSignalNotificationPublisher,
  ],
  exports: [SendNotificationUseCase],
})
export class NotificationModule {}
