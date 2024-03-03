import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { Option } from 'oxide.ts';
import {
  AUTHENTICATION_REPOSITORY,
  AuthenticationRepository,
} from '../../../application/ports/authentication.repository.port';
import {
  PASSWORD_MANAGER,
  PasswordManagerPort,
} from '../../../application/ports/password-manager.port';
import { Authentication } from '../../../domain/authentication.entity';
import { ValidateRefreshTokenQuery } from './valiate-refresh-token.query';

@QueryHandler(ValidateRefreshTokenQuery)
export class ValidateRefreshTokenQueryHandler {
  constructor(
    @Inject(AUTHENTICATION_REPOSITORY)
    private authenticationRepository: AuthenticationRepository,
    @Inject(PASSWORD_MANAGER)
    private passwordManager: PasswordManagerPort,
  ) {}

  async execute(query: ValidateRefreshTokenQuery): Promise<boolean> {
    const authentication: Option<Authentication> =
      await this.authenticationRepository.findOneById(query.authenticationId);
    if (
      authentication.isNone() ||
      authentication.unwrap().refreshToken.isNone()
    ) {
      return false;
    }

    return this.passwordManager.comparePassword(
      query.refreshToken,
      authentication.unwrap().refreshToken.unwrap(),
    );
  }
}
