import { DomainEvent } from '@core/domain-events/domain-event';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Notification } from '../notifications';

export class NotificationCreated implements DomainEvent {
  ocurredAt: Date;

  constructor(public readonly notification: Notification) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.notification.toUniqueEntityID();
  }
}
