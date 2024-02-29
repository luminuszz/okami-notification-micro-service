import { AggregateRoot } from '@core/aggregate-root';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Channel } from './channel';
import { MobilePushSubscription } from './mobile-push-subscription';
import { WebPushSubscription } from './web-push-subscription';

export interface SubscriberProps {
  recipientId: string;
  createdAt?: Date;
  updatedAt?: Date;
  email: string;
  telegramChatId?: string;

  channels?: Channel[];
  mobilePushSubscriptions?: MobilePushSubscription[];
  webPushSubscriptions?: WebPushSubscription[];
}

export class Subscriber extends AggregateRoot<SubscriberProps> {
  private constructor(props: SubscriberProps, id?: UniqueEntityID) {
    super(props, id);

    this.props.createdAt = props.createdAt ?? new Date();
    this.props.mobilePushSubscriptions = props.mobilePushSubscriptions ?? [];
    this.props.webPushSubscriptions = props.webPushSubscriptions ?? [];
  }

  public static create(props: SubscriberProps, id?: UniqueEntityID): Subscriber {
    return new Subscriber(props, id);
  }

  get recipientId(): string {
    return this.props.recipientId;
  }

  get telegramChatId(): string | undefined {
    return this.props.telegramChatId;
  }

  private update() {
    this.props.updatedAt = new Date();
  }

  public get channels() {
    return this.props.channels;
  }

  public set telegramChatId(telegramChatId: string) {
    this.props.telegramChatId = telegramChatId;
    this.update();
  }

  public get mobilePushSubscriptions() {
    return this.props.mobilePushSubscriptions;
  }

  public get webPushSubscriptions() {
    return this.props.webPushSubscriptions;
  }

  public get email() {
    return this.props.email;
  }
}
