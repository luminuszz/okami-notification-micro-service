import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { NewSubscriberDto } from './dto/new-subscriber.dto';
import { CreateSubscriber } from '@domain/subscriber/use-cases/create-subscriber';
import { RegisterSubscriberInChannelDto } from './dto/register-subscriber-in-channel.dto';
import { SubscribeInChannel } from '@domain/subscriber/use-cases/subscribe-in-channel';
import { SendNotificationDto } from './dto/send-notification.dto';
import { SendNotificationUseCase } from '@domain/notification/use-cases/send-notification';

@Controller('client')
export class AppController {
  constructor(
    private readonly createSubscriber: CreateSubscriber,
    private readonly subscribeInChannel: SubscribeInChannel,
    private readonly sendNotification: SendNotificationUseCase,
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

  @EventPattern('send-notification')
  async publishNotification(@Payload() { content, recipientId }: SendNotificationDto) {
    await this.sendNotification.execute({
      content,
      recipientId,
    });
  }
}
