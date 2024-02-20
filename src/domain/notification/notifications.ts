import { AggregateRoot } from '@core/aggregate-root';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Subscriber } from '@domain/subscriber/entities/subscriber';

export interface NotificationProps {
  content: string;
  subscriberId: string;
  readAt?: Date | null;
  createdAt: Date;
  recipient?: Subscriber;
}

export class Notification extends AggregateRoot<NotificationProps> {
  private constructor(props: NotificationProps, id?: UniqueEntityID) {
    super(props, id);

    this.props.createdAt = props.createdAt ?? new Date();
    this.props.readAt = props.readAt ?? null;
  }
  public static create(props: NotificationProps, id?: UniqueEntityID): Notification {
    return new Notification(props, id);
  }

  get content(): string {
    return this.props.content;
  }

  get subscriberId(): string {
    return this.props.subscriberId;
  }

  get readAt() {
    return this.props.readAt;
  }

  markAsRead(): void {
    this.props.readAt = new Date();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get recipient() {
    return this.props.recipient;
  }
}
