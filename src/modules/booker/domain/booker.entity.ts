import { AggregateRoot, EntityID } from '@libs/ddd';
import { Guard } from '@src/libs/core/guard';
import { Err, Ok, Result } from 'oxide.ts';
import { BookerError } from './booker.errors';
import { BookerRegisteredEvent } from './events/booker-registered.event';
import { BookerEmail } from './value-objects/booker-email';

export interface BookerProps {
  email: BookerEmail;
}

export class Booker extends AggregateRoot<BookerProps> {
  get email(): BookerEmail {
    return this.props.email;
  }

  private constructor(props: BookerProps, id?: EntityID) {
    super(props, id);
  }

  static create(
    props: BookerProps,
    id?: EntityID,
  ): Result<Booker, BookerError> {
    const guardResult = Guard.againstNullOrUndefined(props.email, 'email');
    if (guardResult.isErr()) {
      return Err(new BookerError(guardResult.unwrapErr()));
    }

    const isNew = !id;
    const booker = new Booker(props, id);

    if (isNew) {
      booker.addDomainEvent(new BookerRegisteredEvent(booker));
    }

    return Ok(booker);
  }
}
