import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { MobilePushSubscription } from '../entities/mobile-push-subscription';
import { Injectable } from '@nestjs/common';
import { MobilePushSubscriptionRepository } from './repositories/mobile-push-subscription-repository';

interface CreateMobilePushSubscriptionRequest {
  subscriberId: string;
  subscriptionToken: string;
}

type CreateMobilePushSubscriptionResponse = Either<void, { mobilePushSubscription: MobilePushSubscription }>;

@Injectable()
export class CreateMobilePushSubscription
  implements UseCaseImplementation<CreateMobilePushSubscriptionRequest, CreateMobilePushSubscriptionResponse>
{
  constructor(private readonly mobilePushSubscriptionRepository: MobilePushSubscriptionRepository) {}

  async execute({
    subscriberId,
    subscriptionToken,
  }: CreateMobilePushSubscriptionRequest): Promise<CreateMobilePushSubscriptionResponse> {
    const mobileToken = MobilePushSubscription.create({
      createdAt: new Date(),
      subscriberId,
      subscriptionToken,
    });

    await this.mobilePushSubscriptionRepository.create(mobileToken);

    return right({ mobilePushSubscription: mobileToken });
  }
}
