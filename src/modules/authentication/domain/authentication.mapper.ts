import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd/mapper.interface';
import { None, Some } from 'oxide.ts';

import {
  AuthenticationModel,
  authenticationSchema,
} from '../infrastructure/database/authentication.model';
import { AuthenticationEntity } from './authentication.entity';

@Injectable()
export class AuthenticationMapper
  implements Mapper<AuthenticationEntity, AuthenticationModel>
{
  toDomain(record: AuthenticationModel): AuthenticationEntity {
    return new AuthenticationEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        bookerId: record.bookerId,
        email: record.email,
        password: record.password,
        accessToken: record.accessToken ? Some(record.accessToken) : None,
        refreshToken: record.refreshToken ? Some(record.refreshToken) : None,
      },
    });
  }

  toPersistence(entity: AuthenticationEntity): AuthenticationModel {
    const record: AuthenticationModel = {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
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
