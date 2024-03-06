import { SendNotificationUseCase } from '@domain/notification/use-cases/send-notification';
import { CreateMobilePushSubscription } from '@domain/subscriber/use-cases/create-mobile-push-subscription';
import { CreateSubscriber } from '@domain/subscriber/use-cases/create-subscriber';
import { CreateWebPushSubscription } from '@domain/subscriber/use-cases/create-web-push-subscription';
import { FindSubscriberByRecipientId } from '@domain/subscriber/use-cases/find-subscriber-by-recipient-id';
import { SubscribeInChannel } from '@domain/subscriber/use-cases/subscribe-in-channel';
import { UpdateSubscriberEmailByRecipientId } from '@domain/subscriber/use-cases/update-subscriber-email-by-recipient-id';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateMobilePushSubscriptionDto } from './dto/create-mobile-push-subscription.dto';
import { CreateWebPushSubscriptionDto } from './dto/create-web-push-subscription.dto';
import { NewSubscriberDto } from './dto/new-subscriber.dto';
import { RegisterSubscriberInChannelDto } from './dto/register-subscriber-in-channel.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { EnvService } from './env/env.service';

@Controller('client')
export class AppController {
  constructor(
    private readonly createSubscriber: CreateSubscriber,
    private readonly subscribeInChannel: SubscribeInChannel,
    private readonly sendNotification: SendNotificationUseCase,
    private readonly createSubscriberMobilePush: CreateMobilePushSubscription,
    private readonly createWebPushSubscription: CreateWebPushSubscription,
    private readonly findSubscriberByRecipientId: FindSubscriberByRecipientId,
    private readonly env: EnvService,
    private readonly updateSubscriberEmailByRecipientId: UpdateSubscriberEmailByRecipientId,
  ) {}

  @EventPattern('new-subscriber')
  async onNewSubscriber(@Payload() data: NewSubscriberDto) {
    await this.createSubscriber.execute(data);
  }

  @EventPattern('subscriber-email-updated')
  async onSubscriberEmailUpdated(@Payload() { recipientId, email }: { recipientId: string; email: string }) {
    const results = await this.updateSubscriberEmailByRecipientId.execute({
      recipientId,
      email,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }

  @MessagePattern('register-subscriber-in-channel')
  async registerSubscriberInChannel(@Payload() payload: RegisterSubscriberInChannelDto) {
    const response = await this.subscribeInChannel.execute({
      channelId: payload.channelId,
      subscriberId: payload.subscriberId,
    });
    if (response.isLeft()) {
      throw response.value;
    }
  }

  @EventPattern('create-notification')
  async publishNotification(@Payload() payload: SendNotificationDto) {
    const response = await this.sendNotification.execute({
      content: payload.content,
      recipientId: payload.recipientId,
      channels: payload.channels,
      providers: payload.providers,
    });

    if (response.isLeft()) {
      throw response.value;
    }
  }

  @MessagePattern('create-mobile-push-subscription')
  async addMobileSubscription(@Payload() { subscriptionToken, subscriberId }: CreateMobilePushSubscriptionDto) {
    const response = await this.createSubscriberMobilePush.execute({
      recipientId: subscriberId,
      subscriptionToken,
    });

    if (response.isLeft()) {
      throw response.value;
    }
  }

  @MessagePattern('send-web-push-public-key')
  async sendPublicKey() {
    return {
      publicKey: this.env.get('WEB_PUSH_PUBLIC_KEY'),
    };
  }

  @MessagePattern('create-web-push-subscription')
  async addWebSubscription(@Payload() payload: CreateWebPushSubscriptionDto) {
    const response = await this.createWebPushSubscription.execute({
      recipientId: payload.subscriberId,
      endpoint: payload.endpoint,
      webPushSubscriptionAuth: payload.webPushSubscriptionAuth,
      webPushSubscriptionP256dh: payload.webPushSubscriptionP256dh,
    });

    if (response.isLeft()) {
      throw response.value;
    }
  }

  @MessagePattern('get-subscriber')
  async getSubscriber(@Payload() { recipientId }: { recipientId: string }) {
    const response = await this.findSubscriberByRecipientId.execute({ recipientId });

    if (response.isLeft()) {
      throw response.value;
    }

    const { subscriber } = response.value;

    return {
      id: subscriber.id,
      email: subscriber.email,
      recipientId: subscriber.recipientId,
      telegramChatId: subscriber.telegramChatId,
    };
  }
}
