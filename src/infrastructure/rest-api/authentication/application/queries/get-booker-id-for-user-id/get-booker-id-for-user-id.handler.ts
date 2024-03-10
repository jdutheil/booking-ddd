import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import {
  AUTHENTICATION_REPOSITORY,
  AuthenticationRepository,
} from '../../ports/authentication.repository.port';
import { GetBookerIdForUserIdQuery } from './get-booker-id-for-user-id.query';

@QueryHandler(GetBookerIdForUserIdQuery)
export class GetBookerIdForUserIdQueryHandler {
  constructor(
    @Inject(AUTHENTICATION_REPOSITORY)
    private authenticationRepository: AuthenticationRepository,
  ) {}

  async execute(
    query: GetBookerIdForUserIdQuery,
  ): Promise<Result<EntityID, Error>> {
    const authenticationResult =
      await this.authenticationRepository.findOneByUserId(query.userId);
    if (authenticationResult.isNone()) {
      return Err(new Error('Authentication not found'));
    }

    return Ok(authenticationResult.unwrap().bookerId);
  }
}
