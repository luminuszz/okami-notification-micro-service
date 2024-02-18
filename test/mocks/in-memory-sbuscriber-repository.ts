import { SubscriberRepository } from '@domain/subscriber/subscriber-repository';
import { Subscriber } from '@domain/subscriber/subscriber';

export class InMemorySubscriberRepository implements SubscriberRepository {
  private subscribers: Subscriber[] = [];

  async create(subscriber: Subscriber): Promise<void> {
    this.subscribers.push(subscriber);
  }
}
