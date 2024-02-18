import { DomainEvent } from './domain-event';

export interface DomainEventHandler<Event extends DomainEvent> {
  setupSubscriptions(): void;

  handle(event: Event): Promise<void>;
}
