import { EntityID } from '@src/libs/ddd';

export class BookerRegisteredEvent {
  static readonly eventName = 'booker.registered' as const;

  readonly id: EntityID;
  readonly email: string;
  readonly password: string;

  constructor(props: BookerRegisteredEvent) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
  }
}
