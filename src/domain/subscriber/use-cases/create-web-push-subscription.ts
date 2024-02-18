import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { WePushSubscriptionRepository } from './repositories/web-push-subscription-repository';
import { WebPushSubscription } from '../entities/web-push-subscription';

interface CreateWebPushSubscriptionRequest {
  webPushSubscriptionAuth: string;
  webPushSubscriptionP256dh: string;
  endpoint: string;
  subscriberId: string;
}

type CreateWebPushSubscriptionResponse = Either<void, { webPushSubscription: WebPushSubscription }>;

@Injectable()
export class CreateWebPushSubscription
  implements UseCaseImplementation<CreateWebPushSubscriptionRequest, CreateWebPushSubscriptionResponse>
{
  constructor(private readonly webPushSubscriptionRepository: WePushSubscriptionRepository) {}

  async execute(input: CreateWebPushSubscriptionRequest): Promise<CreateWebPushSubscriptionResponse> {
    const webPushSubscription = WebPushSubscription.create({
      endpoint: input.endpoint,
      subscriberId: input.subscriberId,
      webPushSubscriptionAuth: input.webPushSubscriptionAuth,
      webPushSubscriptionP256dh: input.webPushSubscriptionP256dh,
      createdAt: new Date(),
    });

    await this.webPushSubscriptionRepository.create(webPushSubscription);

    return right({
      webPushSubscription,
    });
  }
}
