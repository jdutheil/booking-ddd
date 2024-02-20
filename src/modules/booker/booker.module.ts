import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { CreateBookerHttpController } from './commands/create-booker/create-booker.http.controller';
import { CreateBookerService } from './commands/create-booker/create-booker.service';
import { BookerPrismaRepository } from './database/booker.prisma-repository';
import { USER_REPOSITORY } from './database/booker.repository.port';
import { BookerMapper } from './domain/booker.mapper';

const httpControllers = [CreateBookerHttpController];

const commandHandlers: Provider[] = [CreateBookerService];
const mappers: Provider[] = [BookerMapper];
const repositories: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: BookerPrismaRepository,
  },
];

@Module({
  imports: [PrismaModule, CqrsModule],
  controllers: [...httpControllers],
  providers: [...mappers, ...repositories, ...commandHandlers],
})
export class BookerModule {}
