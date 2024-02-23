import { SendNotificationUseCase } from '@domain/notification/use-cases/send-notification';
import { CreateMobilePushSubscription } from '@domain/subscriber/use-cases/create-mobile-push-subscription';
import { CreateSubscriber } from '@domain/subscriber/use-cases/create-subscriber';
import { CreateWebPushSubscription } from '@domain/subscriber/use-cases/create-web-push-subscription';
import { SubscribeInChannel } from '@domain/subscriber/use-cases/subscribe-in-channel';
import { UpdateSubscriberTelegramChatId } from '@domain/subscriber/use-cases/update-subscriber-telegram-chat-id';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateMobilePushSubscriptionDto } from './dto/create-mobile-push-subscription.dto';
import { CreateWebPushSubscriptionDto } from './dto/create-web-push-subscription.dto';
import { NewSubscriberDto } from './dto/new-subscriber.dto';
import { RegisterSubscriberInChannelDto } from './dto/register-subscriber-in-channel.dto';
import { RegisterTelegramChatIdDto } from './dto/register-telegram-chat-id';
import { SendNotificationDto } from './dto/send-notification.dto';
import { EnvService } from './env/env.service';

@Controller('client')
export class AppController {
  constructor(
    private readonly createSubscriber: CreateSubscriber,
    private readonly subscribeInChannel: SubscribeInChannel,
    private readonly sendNotification: SendNotificationUseCase,
    private readonly updateSubscriberTelegramChatId: UpdateSubscriberTelegramChatId,
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
    console.log('publishNotification', content, recipientId);

    await this.sendNotification.execute({
      content,
      recipientId,
    });
  }

  @MessagePattern('register-telegram-chat')
  async registerTelegramChat(@Payload() { telegramChatId, subscriberId }: RegisterTelegramChatIdDto) {
    await this.updateSubscriberTelegramChatId.execute({
      telegramChatId,
      recipientId: subscriberId,
    });
  }

  @MessagePattern('create-mobile-push-subscription')
  async addMobileSubscription(@Payload() { subscriptionToken, subscriberId }: CreateMobilePushSubscriptionDto) {
    await this.createSubscriberMobilePush.execute({
      recipientId: subscriberId,
      subscriptionToken,
    });
  }

  @MessagePattern('send-web-push-public-key')
  async sendPublicKey() {
    return {
      publicKey: this.env.get('WEB_PUSH_PUBLIC_KEY'),
    };
  }

  @MessagePattern('create-web-push-subscription')
  async addWebSubscription(@Payload() payload: CreateWebPushSubscriptionDto) {
    await this.createWebPushSubscription.execute({
      recipientId: payload.subscriberId,
      endpoint: payload.endpoint,
      webPushSubscriptionAuth: payload.webPushSubscriptionAuth,
      webPushSubscriptionP256dh: payload.webPushSubscriptionP256dh,
    });
  }

  @MessagePattern('notificaiton.send-to-channel')
  async sendNotificationToChannel(@Payload() payload: SendNotificationDto) {
    console.log('sendNotificationToChannel', payload);

    await this.sendNotification.execute({
      content: payload.content,
      recipientId: payload.recipientId,
      channels: payload.channels,
    });
  }
}
