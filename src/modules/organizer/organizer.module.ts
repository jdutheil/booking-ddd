import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { CreateOrganizerService } from './application/commands/create-organizer/create-organizer.service';
import { OrganizerMapper } from './domain/organizer.mapper';
import { OrganizerPrismaRepository } from './infrastructure/persistence/organizer.prisma.repository';
import { ORGANIZER_REPOSITORY } from './infrastructure/persistence/organizer.repository';

const commandHandlers: Provider[] = [CreateOrganizerService];
const mappers: Provider[] = [OrganizerMapper];
const repositories: Provider[] = [
  {
    provide: ORGANIZER_REPOSITORY,
    useClass: OrganizerPrismaRepository,
  },
];

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [...mappers, ...repositories, ...commandHandlers],
})
export class OrganizerModule {}
