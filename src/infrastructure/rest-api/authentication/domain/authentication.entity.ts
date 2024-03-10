import { Guard } from '@src/libs/core/guard';
import { AggregateRoot, EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { AuthenticationError } from './authentication.errors';
import { AuthenticationCreatedEvent } from './events/authentication-created.event';

export type UserId = string;

export interface AuthenticationProps {
  bookerId: EntityID;
  userId: UserId;
}

export class Authentication extends AggregateRoot<AuthenticationProps> {
  get bookerId(): EntityID {
    return this.props.bookerId;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  private constructor(props: AuthenticationProps, id?: EntityID) {
    super(props, id);
  }

  static create(
    props: AuthenticationProps,
    id?: EntityID,
  ): Result<Authentication, AuthenticationError> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.bookerId, argumentName: 'bookerId' },
      { argument: props.userId, argumentName: 'userId' },
    ]);
    if (guardResult.isErr()) {
      return Err(new AuthenticationError(guardResult.unwrapErr()));
    }

    const isNew = !id;
    const authentication = new Authentication(props, id);

    if (isNew) {
      authentication.addDomainEvent(
        new AuthenticationCreatedEvent(authentication),
      );
    }

    return Ok(authentication);
  }
}
