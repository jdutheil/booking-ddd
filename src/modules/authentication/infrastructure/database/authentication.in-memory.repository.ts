import { Injectable } from '@nestjs/common';
import { Paginated, PaginatedQueryParams } from '@src/libs/ddd';
import { None, Option, Some } from 'oxide.ts';
import { AuthenticationRepositoryPort } from '../../application/ports/authentication.repository.port';
import { AuthenticationEntity } from '../../domain/authentication.entity';
import {
  AuthenticationAlreadyExistsError,
  AuthenticationNotFoundError,
} from '../../domain/authentication.errors';

@Injectable()
export class AuthenticationInMemoryRepository
  implements AuthenticationRepositoryPort
{
  authentications: AuthenticationEntity[] = [];

  async save(
    entity: AuthenticationEntity | AuthenticationEntity[],
  ): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];

    entities.forEach((entity) => {
      const foundEntity = this.authentications.find(
        (authentication) =>
          authentication.id === entity.id ||
          authentication.email === entity.email,
      );
      if (foundEntity) {
        throw new AuthenticationAlreadyExistsError();
      }
    });

    this.authentications.push(...entities);
  }

  async findOneById(id: string): Promise<Option<AuthenticationEntity>> {
    const authentication = this.authentications.find(
      (authentication) => authentication.id === id,
    );
    return authentication ? Some(authentication) : None;
  }

  async findOneByEmail(email: string): Promise<Option<AuthenticationEntity>> {
    const authentication = this.authentications.find(
      (authentication) => authentication.email === email,
    );
    return authentication ? Some(authentication) : None;
  }

  async findAll(): Promise<AuthenticationEntity[]> {
    return this.authentications;
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<AuthenticationEntity>> {
    const { limit, page, offset } = params;
    const data = this.authentications.slice(offset, offset + limit);
    return {
      data,
      count: this.authentications.length,
      page,
      limit,
    };
  }

  async delete(entity: AuthenticationEntity): Promise<boolean> {
    const index = this.authentications.findIndex(
      (authentication) => authentication.id === entity.id,
    );
    if (index === -1) {
      throw new AuthenticationNotFoundError();
    }
    this.authentications.splice(index, 1);
    return true;
  }
}
