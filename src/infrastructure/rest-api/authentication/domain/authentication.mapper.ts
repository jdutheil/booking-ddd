import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd/mapper.interface';

import {
  AuthenticationModel,
  authenticationSchema,
} from '../infrastructure/database/authentication.model';
import { Authentication } from './authentication.entity';
import { AuthenticationError } from './authentication.errors';

@Injectable()
export class AuthenticationMapper
  implements Mapper<Authentication, AuthenticationModel>
{
  toDomain(record: AuthenticationModel): Authentication {
    const result = Authentication.create(
      {
        bookerId: record.bookerId,
        userId: record.userId,
      },
      record.id,
    );

    if (result.isErr()) {
      throw new AuthenticationError(
        'An error occured during Authentication mapping',
        result.unwrapErr(),
      );
    }

    return result.unwrap();
  }

  toPersistence(entity: Authentication): AuthenticationModel {
    const record: AuthenticationModel = {
      id: entity.id,
      userId: entity.userId,
      bookerId: entity.bookerId,
    };

    return authenticationSchema.parse(record);
  }
}
