import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { CreateWebPushSubscription } from '@domain/subscriber/use-cases/create-web-push-subscription';
import { CreateMobilePushSubscription } from '@domain/subscriber/use-cases/create-mobile-push-subscription';
import { CreateSubscriber } from '@domain/subscriber/use-cases/create-subscriber';
import { UpdateSubscriber } from '@domain/subscriber/use-cases/update-subscriber';
import { SubscribeInChannel } from '@domain/subscriber/use-cases/subscribe-in-channel';
import { DeleteWebPushSubscription } from '@domain/subscriber/use-cases/delete-web-push-subscription';

@Module({
  imports: [PrismaModule],
  providers: [
    CreateWebPushSubscription,
    CreateMobilePushSubscription,
    CreateSubscriber,
    UpdateSubscriber,
    SubscribeInChannel,
    DeleteWebPushSubscription,
  ],
  exports: [
    CreateWebPushSubscription,
    CreateMobilePushSubscription,
    CreateSubscriber,
    UpdateSubscriber,
    SubscribeInChannel,
    DeleteWebPushSubscription,
  ],
})
export class SubscriberModule {}
