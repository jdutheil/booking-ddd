import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { AggregateID } from '@src/libs/ddd';
import { Result } from 'oxide.ts';
import { Strategy } from 'passport-local';
import { ValidateAuthenticationQuery } from '../../application/queries/validate-authentication/validate-authentication.query';
import { AuthenticationError } from '../../domain/authentication.errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const authentication: Result<AggregateID, AuthenticationError> =
      await this.queryBus.execute(
        new ValidateAuthenticationQuery({ email, password }),
      );

    if (authentication.isErr()) {
      throw new UnauthorizedException();
    }

    return {
      id: authentication.unwrap(),
    };
  }
}
