import { AggregateID } from '@src/libs/ddd';

export class BookerCreatedEvent {
  static readonly eventName = 'booker.created' as const;

  readonly id: AggregateID;

  constructor(id: AggregateID) {
    this.id = id;
  }
}
