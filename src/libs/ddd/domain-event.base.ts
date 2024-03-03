import { randomUUID } from 'crypto';
import { EntityID } from './entity.base';

type DomainEventMetadata = {
  readonly timestamp: number;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: EntityID;
  metadata?: DomainEventMetadata;
};

export abstract class DomainEvent {
  public readonly id: string;
  public readonly aggregateId: EntityID;
  public readonly metadata: DomainEventMetadata;

  protected constructor(props: DomainEventProps<DomainEvent>) {
    this.id = randomUUID();
    this.aggregateId = props.aggregateId;
    this.metadata = {
      timestamp: props?.metadata?.timestamp || Date.now(),
    };
  }
}
