import { RepositoryPort } from '@src/libs/ddd';
import { Option } from 'oxide.ts';
import { BookerEntity } from '../domain/booker.entity';

export interface BookerRepositoryPort extends RepositoryPort<BookerEntity> {
  findOneByEmail(email: string): Promise<Option<BookerEntity>>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
