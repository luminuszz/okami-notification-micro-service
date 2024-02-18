import { DomainEvent } from './domain-events/domain-event';
import { DomainEvents } from './domain-events/domain-events';
import { Entity } from './entities/entity';
import { UniqueEntityID } from './entities/unique-entity-id';

export class AggregateRoot<Props> extends Entity<Props> {
  constructor(props: Props, id?: UniqueEntityID) {
    super(props, id);
  }

  private events: DomainEvent[] = [];

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this.events.push(domainEvent);
    DomainEvents.markAggregateForDispatch(this);
  }

  public clearEvents() {
    this.events = [];
  }

  get domainEvents(): DomainEvent[] {
    return this.events;
  }
}
