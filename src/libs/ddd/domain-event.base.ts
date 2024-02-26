import { randomUUID } from 'crypto';
import { AggregateID } from './entity.base';

type DomainEventMetadata = {
  readonly timestamp: number;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: AggregateID;
  metadata?: DomainEventMetadata;
};

export abstract class DomainEvent {
  public readonly id: string;
  public readonly aggregateId: AggregateID;
  public readonly metadata: DomainEventMetadata;

  protected constructor(props: DomainEventProps<DomainEvent>) {
    this.id = randomUUID();
    this.aggregateId = props.aggregateId;
    this.metadata = {
      timestamp: props?.metadata?.timestamp || Date.now(),
    };
  }
}
