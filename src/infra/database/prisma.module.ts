import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SubscriberRepository } from '@domain/subscriber/use-cases/repositories/subscriber-repository';
import { PrismaSubscriberRepository } from './repositories/prisma-subscriber.repository';
import { ChannelRepository } from '@domain/subscriber/use-cases/repositories/channel-repository';
import { PrismaChannelRepository } from './repositories/prisma-channel.repository';
import { NotificationRepository } from '@domain/notification/notification.repository';
import { PrismaNotificationRepository } from './repositories/prisma-notification.repository';
import { PrismaWebPushSubscriptionRepository } from './repositories/prisma-web-push-subscription.repository';
import { MobilePushSubscriptionRepository } from '@domain/subscriber/use-cases/repositories/mobile-push-subscription-repository';
import { PrismaMobilePushSubscriptionRepository } from './repositories/prisma-mobile-subscription.repository';
import { WePushSubscriptionRepository } from '@domain/subscriber/use-cases/repositories/web-push-subscription-repository';

@Module({
  providers: [
    PrismaService,
    { provide: SubscriberRepository, useClass: PrismaSubscriberRepository },
    { provide: ChannelRepository, useClass: PrismaChannelRepository },
    { provide: NotificationRepository, useClass: PrismaNotificationRepository },
    { provide: WePushSubscriptionRepository, useClass: PrismaWebPushSubscriptionRepository },
    { provide: MobilePushSubscriptionRepository, useClass: PrismaMobilePushSubscriptionRepository },
  ],

  exports: [
    SubscriberRepository,
    ChannelRepository,
    NotificationRepository,
    WePushSubscriptionRepository,
    MobilePushSubscriptionRepository,
  ],
})
export class PrismaModule {}
