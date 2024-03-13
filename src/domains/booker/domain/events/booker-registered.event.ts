import { DomainEvent } from '@src/libs/ddd';
import { Booker } from '../booker.entity';

export class BookerRegisteredEvent extends DomainEvent {
  constructor(public readonly booker: Booker) {
    super({ aggregateId: booker.id });
  }
}
