import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { CreateContactService } from './application/commands/create-contact/create-contact.service';
import { ContactMapper } from './domain/contact.mapper';
import { ContactPrismaRepository } from './infrastructure/persistence/contact.prisma.repository';
import { CONTACT_REPOSITORY } from './infrastructure/persistence/contact.repository';

const commandHandlers: Provider[] = [CreateContactService];
const mappers: Provider[] = [ContactMapper];
const repositories: Provider[] = [
  {
    provide: CONTACT_REPOSITORY,
    useClass: ContactPrismaRepository,
  },
];

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [...mappers, ...repositories, ...commandHandlers],
})
export class ContactModule {}
