import { AggregateRoot } from '@core/aggregate-root';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

export interface MobilePushSubscriptionProps {
  subscriberId: string;
  subscriptionToken: string;

  createdAt: Date;
}

export class MobilePushSubscription extends AggregateRoot<MobilePushSubscriptionProps> {
  private constructor(props: MobilePushSubscriptionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get subscriberId(): string {
    return this.props.subscriberId;
  }

  get subscriptionToken(): string {
    return this.props.subscriptionToken;
  }

  static create(props: MobilePushSubscriptionProps, id?: UniqueEntityID): MobilePushSubscription {
    return new MobilePushSubscription(props, id);
  }
}
