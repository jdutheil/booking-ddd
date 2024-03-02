import { Guard } from '@src/libs/core/guard';
import { AggregateRoot, EntityID } from '@src/libs/ddd';
import { Err, None, Ok, Option, Result, Some } from 'oxide.ts';
import { AuthenticationError } from './authentication.errors';
import { AuthenticationCreatedEvent } from './events/authentication-created.event';

export type AuthenticationEmail = string;
export type Password = string;
export type AccessToken = string;
export type RefreshToken = string;

export interface AuthenticationProps {
  bookerId: EntityID;
  email: AuthenticationEmail;
  password: Password;
  accessToken: Option<AccessToken>;
  refreshToken: Option<RefreshToken>;
}

export class Authentication extends AggregateRoot<AuthenticationProps> {
  get bookerId(): EntityID {
    return this.props.bookerId;
  }

  get email(): AuthenticationEmail {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get accessToken(): Option<AccessToken> {
    return this.props.accessToken;
  }

  get refreshToken(): Option<RefreshToken> {
    return this.props.refreshToken;
  }

  public updateRefreshToken(refreshToken: RefreshToken): void {
    this.props.refreshToken = Some(refreshToken);
  }

  public clearRefreshToken(): void {
    this.props.refreshToken = None;
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
      { argument: props.email, argumentName: 'email' },
      { argument: props.password, argumentName: 'password' },
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
