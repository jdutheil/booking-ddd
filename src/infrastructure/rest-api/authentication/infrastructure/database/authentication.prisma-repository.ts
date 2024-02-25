import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { None, Option, Some } from 'oxide.ts';
import { AuthenticationRepositoryPort } from '../../application/ports/authentication.repository.port';
import { AuthenticationEntity } from '../../domain/authentication.entity';
import { AuthenticationAlreadyExistsError } from '../../domain/authentication.errors';
import { AuthenticationMapper } from '../../domain/authentication.mapper';

@Injectable()
export class AuthenticationPrismaRepository
  implements AuthenticationRepositoryPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: AuthenticationMapper,
  ) {}

  async save(entity: AuthenticationEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity);
    try {
      await this.prisma.authentication.create({ data: record });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AuthenticationAlreadyExistsError(error);
      }

      throw error;
    }
  }

  async update(entity: AuthenticationEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity);
    await this.prisma.authentication.update({
      where: { id: entity.id },
      data: record,
    });
  }

  async findOneById(id: string): Promise<Option<AuthenticationEntity>> {
    const authentication = await this.prisma.authentication.findUnique({
      where: { id },
    });
    return authentication ? Some(this.mapper.toDomain(authentication)) : None;
  }

  async findOneByEmail(email: string): Promise<Option<AuthenticationEntity>> {
    const authentication = await this.prisma.authentication.findUnique({
      where: { email },
    });
    return authentication ? Some(this.mapper.toDomain(authentication)) : None;
  }
}
