import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { CreateUserService } from './commands/create-user/create-user.service';
import { UserPrismaRepository } from './database/user.prisma-repository';
import { USER_REPOSITORY } from './database/user.repository.port';
import { UserMapper } from './domain/user.mapper';

const httpControllers = [CreateUserHttpController];

const commandHandlers: Provider[] = [CreateUserService];
const mappers: Provider[] = [UserMapper];
const repositories: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserPrismaRepository,
  },
];

@Module({
  imports: [PrismaModule, CqrsModule],
  controllers: [...httpControllers],
  providers: [...mappers, ...repositories, ...commandHandlers],
})
export class UserModule {}
