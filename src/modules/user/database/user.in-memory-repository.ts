import { Injectable } from '@nestjs/common';
import { Paginated, PaginatedQueryParams } from '@src/libs/ddd';
import { None, Option, Some } from 'oxide.ts';
import { UserEntity } from '../domain/user.entity';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../domain/user.errors';
import { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class UserInMemoryRepository implements UserRepositoryPort {
  users: UserEntity[] = [];

  async save(entity: UserEntity | UserEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];

    entities.forEach((entity) => {
      const foundEntity = this.users.find(
        (user) => user.id === entity.id || user.email === entity.email,
      );
      if (foundEntity) {
        throw new UserAlreadyExistsError();
      }
    });

    this.users.push(...entities);
  }

  async findOneById(id: string): Promise<Option<UserEntity>> {
    const user = this.users.find((user) => user.id === id);
    return user ? Some(user) : None;
  }

  async findOneByEmail(email: string): Promise<Option<UserEntity>> {
    const user = this.users.find((user) => user.email === email);
    return user ? Some(user) : None;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.users;
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<UserEntity>> {
    const { limit, page, offset } = params;
    const data = this.users.slice(offset, offset + limit);
    return {
      data,
      count: this.users.length,
      page,
      limit,
    };
  }

  async delete(entity: UserEntity): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === entity.id);
    if (index === -1) {
      throw new UserNotFoundError();
    }
    this.users.splice(index, 1);
    return true;
  }
}
