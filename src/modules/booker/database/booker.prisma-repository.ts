import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { Paginated, PaginatedQueryParams } from '@src/libs/ddd';
import { None, Option, Some } from 'oxide.ts';
import { BookerEntity } from '../domain/booker.entity';
import {
  BookerAlreadyExistsError,
  BookerError,
  BookerNotFoundError,
} from '../domain/booker.errors';
import { BookerMapper } from '../domain/booker.mapper';
import { BookerRepositoryPort } from './booker.repository.port';

// TODO : DRY with a Generic Repository !

@Injectable()
export class BookerPrismaRepository implements BookerRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: BookerMapper,
  ) {}

  async save(entity: BookerEntity | BookerEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];
    const records = entities.map((entity) => this.mapper.toPersistence(entity));
    try {
      await this.prisma.booker.createMany({ data: records });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BookerAlreadyExistsError(error);
      }

      throw error;
    }
  }

  async update(entity: BookerEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity);
    try {
      await this.prisma.booker.update({
        where: { id: entity.id },
        data: record,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BookerError('Booker Prisma error', error);
      }

      throw error;
    }
  }

  async findOneById(id: string): Promise<Option<BookerEntity>> {
    const booker = await this.prisma.booker.findUnique({ where: { id } });
    return booker ? Some(this.mapper.toDomain(booker)) : None;
  }

  async findOneByEmail(email: string): Promise<Option<BookerEntity>> {
    const booker = await this.prisma.booker.findUnique({ where: { email } });
    return booker ? Some(this.mapper.toDomain(booker)) : None;
  }

  async findAll(): Promise<BookerEntity[]> {
    const bookers = await this.prisma.booker.findMany();
    return bookers.map((booker) => this.mapper.toDomain(booker));
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<BookerEntity>> {
    const { limit, page, offset, orderBy } = params;
    const [count, data] = await Promise.all([
      this.prisma.booker.count(),
      this.prisma.booker.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          [orderBy.field === true ? 'createdAt' : orderBy.field]: orderBy.param,
        },
      }),
    ]);

    return new Paginated({
      count,
      limit,
      page,
      data: data.map((booker) => this.mapper.toDomain(booker)),
    });
  }

  async delete(entity: BookerEntity): Promise<boolean> {
    try {
      const booker = await this.prisma.booker.delete({
        where: { id: entity.id },
      });
      return !!booker;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BookerNotFoundError(error);
      }

      throw error;
    }
  }
}
