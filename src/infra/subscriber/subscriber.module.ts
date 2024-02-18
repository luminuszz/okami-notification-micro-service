import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { CreateWebPushSubscription } from '@domain/subscriber/use-cases/create-web-push-subscription';
import { CreateMobilePushSubscription } from '@domain/subscriber/use-cases/create-mobile-push-subscription';
import { CreateSubscriber } from '@domain/subscriber/use-cases/create-subscriber';
import { UpdateSubscriber } from '@domain/subscriber/use-cases/update-subscriber';
import { SubscribeInChannel } from '@domain/subscriber/use-cases/subscribe-in-channel';

@Module({
  imports: [PrismaModule],
  providers: [
    CreateWebPushSubscription,
    CreateMobilePushSubscription,
    CreateSubscriber,
    UpdateSubscriber,
    SubscribeInChannel,
  ],
  exports: [
    CreateWebPushSubscription,
    CreateMobilePushSubscription,
    CreateSubscriber,
    UpdateSubscriber,
    SubscribeInChannel,
  ],
})
export class SubscriberModule {}
