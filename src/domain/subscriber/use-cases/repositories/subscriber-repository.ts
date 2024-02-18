import { Subscriber } from '../../entities/subscriber';

export abstract class SubscriberRepository {
  abstract create(subscriber: Subscriber): Promise<void>;
  abstract findById(subscriberId: string): Promise<Subscriber | null>;
  abstract save(subscriber: Subscriber): Promise<void>;

  abstract getSubscriptions(subscriberId: string): Promise<Subscriber | null>;
}
