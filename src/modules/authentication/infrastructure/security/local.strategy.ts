import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { AggregateID } from '@src/libs/ddd';
import { Result } from 'oxide.ts';
import { Strategy } from 'passport-local';
import { AuthenticationError } from '../../domain/authentication.errors';
import { ValidateAuthenticationQuery } from '../../queries/validate-authentication/validate-authentication.query';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<AggregateID> {
    const authentication: Result<AggregateID, AuthenticationError> =
      await this.queryBus.execute(
        new ValidateAuthenticationQuery({ email, password }),
      );

    if (authentication.isErr()) {
      throw new UnauthorizedException();
    }

    return authentication.unwrap();
  }
}
