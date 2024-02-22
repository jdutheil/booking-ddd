import { QueryHandler } from '@nestjs/cqrs';
import { AggregateID } from '@src/libs/ddd';
import { Result } from 'oxide.ts';
import { ValidateAuthenticationQuery } from './validate-authentication.query';

@QueryHandler(ValidateAuthenticationQuery)
export class ValidateAuthenticationService {
  async execute(
    query: ValidateAuthenticationQuery,
  ): Promise<Result<AggregateID, Error>> {
    throw new Error('Not implemented');
  }
}
