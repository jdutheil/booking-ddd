import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { RegisterBookerService } from './application/commands/register-booker/register-booker.service';
import { BookerMapper } from './domain/booker.mapper';
import { BookerPrismaRepository } from './infrastructure/persistence/booker.prisma-repository';
import { BOOKER_REPOSITORY } from './infrastructure/persistence/booker.repository.port';

const commandHandlers: Provider[] = [RegisterBookerService];
const mappers: Provider[] = [BookerMapper];
const repositories: Provider[] = [
  {
    provide: BOOKER_REPOSITORY,
    useClass: BookerPrismaRepository,
  },
];

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [...mappers, ...repositories, ...commandHandlers],
})
export class BookerModule {}
