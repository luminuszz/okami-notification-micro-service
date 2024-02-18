import { UseCaseImplementation } from '@core/use-case';
import { Subscriber } from '../entities/subscriber';
import { SubscriberRepository } from './repositories/subscriber-repository';
import { Either, right } from '@core/either';
import { Injectable } from '@nestjs/common';

export interface CreateSubscriberProps {
  recipientId: string;

  telegramChatId?: string;
  webPushSubscriptionAuth?: string;
  webPushSubscriptionP256dh?: string;
  mobilePushToken?: string;
}

type CreateSubscriberResponse = Either<void, { subscriber: Subscriber }>;

@Injectable()
export class CreateSubscriber implements UseCaseImplementation<CreateSubscriberProps, CreateSubscriberResponse> {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(payload: CreateSubscriberProps): Promise<CreateSubscriberResponse> {
    const subscriber = Subscriber.create({
      recipientId: payload.recipientId,
      telegramChatId: payload.telegramChatId,
    });

    await this.subscriberRepository.create(subscriber);

    return right({ subscriber });
  }
}
