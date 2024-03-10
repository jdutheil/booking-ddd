import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { OrganizerMapper } from './domain/organizer.mapper';

const commandHandlers: Provider[] = [];
const mappers: Provider[] = [OrganizerMapper];
const repositories: Provider[] = [];

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [...mappers, ...repositories, ...commandHandlers],
})
export class OrganizerModule {}
