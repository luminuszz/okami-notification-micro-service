import { Either, right } from '@core/either';
import { SubscriberRepository } from './repositories/subscriber-repository';
import { Subscriber } from '../entities/subscriber';

type Response = Either<void, { subscriber: Subscriber }>;

export class GetSubscriptionBySubscriberId {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(subscriberId: string): Promise<Response> {
    const results = await this.subscriberRepository.getSubscriptions(subscriberId);

    return right({
      subscriber: results,
    });
  }
}
