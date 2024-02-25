import { Injectable } from '@nestjs/common';
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

  async save(entity: AuthenticationEntity): Promise<void> {
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

  async update(entity: AuthenticationEntity): Promise<void> {
    const foundEntityIndex = this.authentications.findIndex(
      (authentication) => authentication.id === entity.id,
    );
    if (foundEntityIndex === -1) {
      throw new AuthenticationNotFoundError();
    }

    this.authentications[foundEntityIndex] = entity;
  }

  async findOneById(id: string): Promise<Option<AuthenticationEntity>> {
    const foundEntity = this.authentications.find(
      (authentication) => authentication.id === id,
    );
    if (!foundEntity) {
      return None;
    }

    return Some(foundEntity);
  }

  async findOneByEmail(email: string): Promise<Option<AuthenticationEntity>> {
    const foundEntity = this.authentications.find(
      (authentication) => authentication.email === email,
    );
    if (!foundEntity) {
      return None;
    }

    return Some(foundEntity);
  }
}
