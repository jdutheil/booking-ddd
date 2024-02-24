import { AggregateID } from '@src/libs/ddd';

export class BookerCreatedEvent {
  static readonly eventName = 'booker.created' as const;

  readonly id: AggregateID;
  readonly email: string;
  readonly password: string;

  constructor(props: BookerCreatedEvent) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
  }
}
