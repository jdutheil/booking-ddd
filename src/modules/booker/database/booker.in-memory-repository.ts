import { Injectable } from '@nestjs/common';
import { Paginated, PaginatedQueryParams } from '@src/libs/ddd';
import { None, Option, Some } from 'oxide.ts';
import { BookerEntity } from '../domain/booker.entity';
import {
  BookerAlreadyExistsError,
  BookerNotFoundError,
} from '../domain/booker.errors';
import { BookerRepositoryPort } from './booker.repository.port';

@Injectable()
export class BookerInMemoryRepository implements BookerRepositoryPort {
  bookers: BookerEntity[] = [];

  async save(entity: BookerEntity | BookerEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];

    entities.forEach((entity) => {
      const foundEntity = this.bookers.find(
        (booker) => booker.id === entity.id || booker.email === entity.email,
      );
      if (foundEntity) {
        throw new BookerAlreadyExistsError();
      }
    });

    this.bookers.push(...entities);
  }

  async findOneById(id: string): Promise<Option<BookerEntity>> {
    const booker = this.bookers.find((booker) => booker.id === id);
    return booker ? Some(booker) : None;
  }

  async findOneByEmail(email: string): Promise<Option<BookerEntity>> {
    const booker = this.bookers.find((booker) => booker.email === email);
    return booker ? Some(booker) : None;
  }

  async findAll(): Promise<BookerEntity[]> {
    return this.bookers;
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<BookerEntity>> {
    const { limit, page, offset } = params;
    const data = this.bookers.slice(offset, offset + limit);
    return {
      data,
      count: this.bookers.length,
      page,
      limit,
    };
  }

  async delete(entity: BookerEntity): Promise<boolean> {
    const index = this.bookers.findIndex((booker) => booker.id === entity.id);
    if (index === -1) {
      throw new BookerNotFoundError();
    }
    this.bookers.splice(index, 1);
    return true;
  }
}
