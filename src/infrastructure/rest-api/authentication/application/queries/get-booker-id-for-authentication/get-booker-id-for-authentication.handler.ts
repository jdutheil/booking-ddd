import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import {
  AUTHENTICATION_REPOSITORY,
  AuthenticationRepositoryPort,
} from '../../ports/authentication.repository.port';
import { GetBookerIdForAuthenticationQuery } from './get-booker-id-for-authentication.query';

@QueryHandler(GetBookerIdForAuthenticationQuery)
export class GetBookerIdForAuthenticationQueryHandler
  implements IQueryHandler<GetBookerIdForAuthenticationQuery>
{
  constructor(
    @Inject(AUTHENTICATION_REPOSITORY)
    private authenticationRepository: AuthenticationRepositoryPort,
  ) {}

  async execute(
    query: GetBookerIdForAuthenticationQuery,
  ): Promise<Result<EntityID, Error>> {
    const authenticationResult =
      await this.authenticationRepository.findOneById(query.authenticationId);

    if (authenticationResult.isNone()) {
      return Err(new Error('Authentication not found'));
    }

    return Ok(authenticationResult.unwrap().bookerId);
  }
}
