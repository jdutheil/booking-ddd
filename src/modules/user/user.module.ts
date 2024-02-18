import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserPrismaRepository } from './database/user.prisma-repository';
import { UserMapper } from './domain/user.mapper';

const providers = [UserMapper, UserPrismaRepository];

@Module({
  imports: [CqrsModule],
  providers: [...providers],
})
export class UserModule {}
