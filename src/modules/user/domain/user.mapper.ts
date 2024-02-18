import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd/mapper.interface';
import { UserModel, userSchema } from '../database/user.model';
import { UserEntity } from './user.entity';

@Injectable()
export class UserMapper implements Mapper<UserEntity, UserModel> {
  toDomain(record: UserModel): UserEntity {
    return new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        email: record.email,
        hashedPassword: record.hashedPassword,
      },
    });
  }

  toPersistence(entity: UserEntity): UserModel {
    const record: UserModel = {
      id: entity.id,
      email: entity.email,
      hashedPassword: entity.hashedPassword,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    return userSchema.parse(record);
  }
}
