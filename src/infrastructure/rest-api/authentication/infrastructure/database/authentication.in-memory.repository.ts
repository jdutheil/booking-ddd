import { Injectable } from '@nestjs/common';
import { None, Option, Some } from 'oxide.ts';
import { AuthenticationRepositoryPort } from '../../application/ports/authentication.repository.port';
import { Authentication } from '../../domain/authentication.entity';
import {
  AuthenticationAlreadyExistsError,
  AuthenticationNotFoundError,
} from '../../domain/authentication.errors';

@Injectable()
export class AuthenticationInMemoryRepository
  implements AuthenticationRepositoryPort
{
  authentications: Authentication[] = [];

  async save(entity: Authentication): Promise<void> {
    const foundEntity = this.authentications.find(
      (authentication) =>
        authentication.id === entity.id ||
        authentication.email === entity.email,
    );
    if (foundEntity) {
      throw new AuthenticationAlreadyExistsError();
    }

    this.authentications.push(entity);
  }

  async update(entity: Authentication): Promise<void> {
    const foundEntityIndex = this.authentications.findIndex(
      (authentication) => authentication.id === entity.id,
    );
    if (foundEntityIndex === -1) {
      throw new AuthenticationNotFoundError();
    }

    this.authentications[foundEntityIndex] = entity;
  }

  async findOneById(id: string): Promise<Option<Authentication>> {
    const foundEntity = this.authentications.find(
      (authentication) => authentication.id === id,
    );
    if (!foundEntity) {
      return None;
    }

    return Some(foundEntity);
  }

  async findOneByEmail(email: string): Promise<Option<Authentication>> {
    const foundEntity = this.authentications.find(
      (authentication) => authentication.email === email,
    );
    if (!foundEntity) {
      return None;
    }

    return Some(foundEntity);
  }
}
