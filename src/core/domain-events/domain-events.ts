import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { AggregateRoot } from '../aggregate-root';
import { DomainEvent } from './domain-event';

type DomainEventCallback = (event: DomainEvent) => void;

export class DomainEvents {
  private static handlersMap: Map<string, DomainEventCallback[]> = new Map<string, DomainEventCallback[]>();
  private static markedAggregates: AggregateRoot<any>[] = [];

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const id = aggregate.toUniqueEntityID();

    const aggregateFound = !!this.findMarkedAggregateByID(id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  public static findMarkedAggregateByID(id: UniqueEntityID): AggregateRoot<any> | undefined {
    return this.markedAggregates.find((agg) => agg.toUniqueEntityID().equals(id));
  }

  public static dispatchAggregateEvents(id: UniqueEntityID): void {
    const aggregate = DomainEvents.findMarkedAggregateByID(id);

    if (!aggregate) {
      return;
    }

    aggregate.domainEvents.forEach((event) => this.dispatch(event));

    aggregate.clearEvents();
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name;

    if (this.handlersMap.has(eventClassName)) {
      const handlers = this.handlersMap.get(eventClassName);

      handlers?.forEach((handler) => handler(event));
    }
  }

  public static register(callback: DomainEventCallback, eventClassName: string) {
    const wasEventRegisteredBefore = this.handlersMap.has(eventClassName);

    if (!wasEventRegisteredBefore) {
      this.handlersMap.set(eventClassName, []);
    }

    this.handlersMap.set(eventClassName, [...(this.handlersMap.get(eventClassName) ?? []), callback]);
  }
}
