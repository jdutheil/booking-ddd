import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { Paginated, PaginatedQueryParams } from '@src/libs/ddd';
import { None, Option, Some } from 'oxide.ts';
import { AuthenticationRepositoryPort } from '../../application/ports/authentication.repository.port';
import { AuthenticationEntity } from '../../domain/authentication.entity';
import {
  AuthenticationAlreadyExistsError,
  AuthenticationNotFoundError,
} from '../../domain/authentication.errors';
import { AuthenticationMapper } from '../../domain/authentication.mapper';

// TODO : DRY with a Generic Repository !

@Injectable()
export class AuthenticationPrismaRepository
  implements AuthenticationRepositoryPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: AuthenticationMapper,
  ) {}

  async save(
    entity: AuthenticationEntity | AuthenticationEntity[],
  ): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];
    const records = entities.map((entity) => this.mapper.toPersistence(entity));
    try {
      await this.prisma.authentication.createMany({ data: records });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AuthenticationAlreadyExistsError(error);
      }

      throw error;
    }
  }

  async findOneById(id: string): Promise<Option<AuthenticationEntity>> {
    const authentication = await this.prisma.authentication.findUnique({
      where: { id },
    });
    return authentication ? Some(this.mapper.toDomain(authentication)) : None;
  }

  async findAll(): Promise<AuthenticationEntity[]> {
    const authentications = await this.prisma.authentication.findMany();
    return authentications.map((authentication) =>
      this.mapper.toDomain(authentication),
    );
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<AuthenticationEntity>> {
    const { limit, page, offset, orderBy } = params;
    const [count, data] = await Promise.all([
      this.prisma.authentication.count(),
      this.prisma.authentication.findMany({
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
      data: data.map((authentication) => this.mapper.toDomain(authentication)),
    });
  }

  async delete(entity: AuthenticationEntity): Promise<boolean> {
    try {
      const authentication = await this.prisma.authentication.delete({
        where: { id: entity.id },
      });
      return !!authentication;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new AuthenticationNotFoundError(error);
      }

      throw error;
    }
  }
}
