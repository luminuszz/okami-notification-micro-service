import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { MobilePushSubscription } from '../entities/mobile-push-subscription';
import { Injectable } from '@nestjs/common';
import { MobilePushSubscriptionRepository } from './repositories/mobile-push-subscription-repository';
import { FindSubscriberByRecipientId } from './find-subscriber-by-recipient-id';
import { ResourceNotFound } from './errors/resource-not-found';
import { InvalidOperation } from '@domain/subscriber/use-cases/errors/invalid-operation';

interface CreateMobilePushSubscriptionRequest {
  recipientId: string;
  subscriptionToken: string;
}

type CreateMobilePushSubscriptionResponse = Either<
  ResourceNotFound | InvalidOperation,
  { mobilePushSubscription: MobilePushSubscription }
>;

@Injectable()
export class CreateMobilePushSubscription
  implements UseCaseImplementation<CreateMobilePushSubscriptionRequest, CreateMobilePushSubscriptionResponse>
{
  constructor(
    private readonly mobilePushSubscriptionRepository: MobilePushSubscriptionRepository,
    private readonly findSubscriberByRecipientId: FindSubscriberByRecipientId,
  ) {}

  async execute({
    subscriptionToken,
    recipientId,
  }: CreateMobilePushSubscriptionRequest): Promise<CreateMobilePushSubscriptionResponse> {
    const results = await this.findSubscriberByRecipientId.execute({ recipientId });

    if (results.isLeft()) {
      return left(results.value);
    }

    const existsSubscription = await this.mobilePushSubscriptionRepository.findBySubscriptionToken(subscriptionToken);

    if (existsSubscription) {
      return left(new InvalidOperation('Subscription already exists'));
    }

    const { subscriber } = results.value;

    const mobileToken = MobilePushSubscription.create({
      createdAt: new Date(),
      subscriberId: subscriber.id,
      subscriptionToken,
    });

    await this.mobilePushSubscriptionRepository.create(mobileToken);

    return right({ mobilePushSubscription: mobileToken });
  }
}
