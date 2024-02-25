import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { BookerEntity } from '../../domain/booker.entity';
import { BookerAlreadyExistsError } from '../../domain/booker.errors';
import { BookerMapper } from '../../domain/booker.mapper';
import { BookerRepositoryPort } from './booker.repository.port';

@Injectable()
export class BookerPrismaRepository implements BookerRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: BookerMapper,
  ) {}

  async register(entity: BookerEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity);
    try {
      await this.prisma.booker.create({ data: record });
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
}
