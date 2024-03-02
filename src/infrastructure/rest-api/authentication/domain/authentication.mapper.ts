import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd/mapper.interface';
import { None, Some } from 'oxide.ts';

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
        email: record.email,
        password: record.password,
        accessToken: record.accessToken ? Some(record.accessToken) : None,
        refreshToken: record.refreshToken ? Some(record.refreshToken) : None,
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
      email: entity.email,
      password: entity.password,
      accessToken: entity.accessToken.isSome()
        ? entity.accessToken.unwrap()
        : null,
      refreshToken: entity.refreshToken.isSome()
        ? entity.refreshToken.unwrap()
        : null,
      bookerId: entity.bookerId,
    };

    return authenticationSchema.parse(record);
  }
}
