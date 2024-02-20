import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { WePushSubscriptionRepository } from './repositories/web-push-subscription-repository';
import { WebPushSubscription } from '../entities/web-push-subscription';
import { FindSubscriberByRecipientId } from './find-subscriber-by-recipient-id';
import { ResourceNotFound } from './errors/resource-not-found';

interface CreateWebPushSubscriptionRequest {
  webPushSubscriptionAuth: string;
  webPushSubscriptionP256dh: string;
  endpoint: string;
  recipientId: string;
}

type CreateWebPushSubscriptionResponse = Either<ResourceNotFound, { webPushSubscription: WebPushSubscription }>;

@Injectable()
export class CreateWebPushSubscription
  implements UseCaseImplementation<CreateWebPushSubscriptionRequest, CreateWebPushSubscriptionResponse>
{
  constructor(
    private readonly webPushSubscriptionRepository: WePushSubscriptionRepository,
    private readonly findSubscriberByRecipientId: FindSubscriberByRecipientId,
  ) {}

  async execute(input: CreateWebPushSubscriptionRequest): Promise<CreateWebPushSubscriptionResponse> {
    const results = await this.findSubscriberByRecipientId.execute({ recipientId: input.recipientId });

    if (results.isLeft()) {
      return left(results.value);
    }

    const { subscriber } = results.value;

    const webPushSubscription = WebPushSubscription.create({
      endpoint: input.endpoint,
      subscriberId: subscriber.id,
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
