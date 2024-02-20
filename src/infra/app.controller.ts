import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { NewSubscriberDto } from './dto/new-subscriber.dto';
import { CreateSubscriber } from '@domain/subscriber/use-cases/create-subscriber';
import { RegisterSubscriberInChannelDto } from './dto/register-subscriber-in-channel.dto';
import { SubscribeInChannel } from '@domain/subscriber/use-cases/subscribe-in-channel';
import { SendNotificationDto } from './dto/send-notification.dto';
import { SendNotificationUseCase } from '@domain/notification/use-cases/send-notification';
import { RegisterTelegramChatIdDto } from './dto/register-telegram-chat-id';
import { UpdateSubscriber } from '@domain/subscriber/use-cases/update-subscriber';
import { CreateMobilePushSubscriptionDto } from './dto/create-mobile-push-subscription.dto';
import { CreateMobilePushSubscription } from '@domain/subscriber/use-cases/create-mobile-push-subscription';
import { CreateWebPushSubscriptionDto } from './dto/create-web-push-subscription.dto';
import { CreateWebPushSubscription } from '@domain/subscriber/use-cases/create-web-push-subscription';
import { EnvService } from './env/env.service';

@Controller('client')
export class AppController {
  constructor(
    private readonly createSubscriber: CreateSubscriber,
    private readonly subscribeInChannel: SubscribeInChannel,
    private readonly sendNotification: SendNotificationUseCase,
    private readonly updateSubscriber: UpdateSubscriber,
    private readonly createSubscriberMobilePush: CreateMobilePushSubscription,
    private readonly createWebPushSubscription: CreateWebPushSubscription,
    private readonly env: EnvService,
  ) {}

  @EventPattern('new-subscriber')
  async onNewSubscriber(@Payload() data: NewSubscriberDto) {
    await this.createSubscriber.execute(data);
  }

  @MessagePattern('register-subscriber-in-channel')
  async registerSubscriberInChannel(@Payload() payload: RegisterSubscriberInChannelDto) {
    await this.subscribeInChannel.execute({
      channelId: payload.channelId,
      subscriberId: payload.subscriberId,
    });
  }

  @EventPattern('create-notification')
  async publishNotification(@Payload() { content, recipientId }: SendNotificationDto) {
    await this.sendNotification.execute({
      content,
      recipientId,
    });
  }

  @MessagePattern('register-telegram-chat')
  async registerTelegramChat(@Payload() { telegramChatId, subscriberId }: RegisterTelegramChatIdDto) {
    await this.updateSubscriber.execute({
      telegramChatId,
      subscriberId,
    });
  }

  @MessagePattern('create-mobile-push-subscription')
  async addMobileSubscription(@Payload() { mobileTokenPush, subscriberId }: CreateMobilePushSubscriptionDto) {
    await this.createSubscriberMobilePush.execute({
      subscriberId,
      subscriptionToken: mobileTokenPush,
    });
  }

  @MessagePattern('send-web-push-public-key')
  async sendPublicKey() {
    return {
      publicKey: this.env.get('WEB_PUSH_PUBLIC_KEY'),
    };
  }

  @MessagePattern('create-web-push-subscription')
  async addWebSubscription(
    @Payload()
    { subscriberId, endpoint, webPushSubscriptionAuth, webPushSubscriptionP256dh }: CreateWebPushSubscriptionDto,
  ) {
    await this.createWebPushSubscription.execute({
      subscriberId,
      endpoint,
      webPushSubscriptionAuth,
      webPushSubscriptionP256dh,
    });
  }
}
