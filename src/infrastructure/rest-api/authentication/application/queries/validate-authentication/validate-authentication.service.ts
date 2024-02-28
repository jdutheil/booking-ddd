import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import {
  AUTHENTICATION_REPOSITORY,
  AuthenticationRepositoryPort,
} from '../../../application/ports/authentication.repository.port';
import {
  PASSWORD_MANAGER,
  PasswordManagerPort,
} from '../../../application/ports/password-manager.port';
import {
  AuthenticationError,
  AuthenticationInvalidEmailError,
  AuthenticationInvalidPasswordError,
} from '../../../domain/authentication.errors';
import { ValidateAuthenticationQuery } from './validate-authentication.query';

@QueryHandler(ValidateAuthenticationQuery)
export class ValidateAuthenticationService {
  constructor(
    @Inject(AUTHENTICATION_REPOSITORY)
    private readonly authenticationRepository: AuthenticationRepositoryPort,
    @Inject(PASSWORD_MANAGER)
    private readonly passwordManager: PasswordManagerPort,
  ) {}

  async execute(
    query: ValidateAuthenticationQuery,
  ): Promise<Result<EntityID, AuthenticationError>> {
    const authentication = await this.authenticationRepository.findOneByEmail(
      query.email,
    );
    if (authentication.isNone()) {
      return Err(new AuthenticationInvalidEmailError());
    }

    const passwordMatches = await this.passwordManager.comparePassword(
      query.password,
      authentication.unwrap().password,
    );
    if (!passwordMatches) {
      return Err(new AuthenticationInvalidPasswordError());
    }

    return Ok(authentication.unwrap().id);
  }
}
