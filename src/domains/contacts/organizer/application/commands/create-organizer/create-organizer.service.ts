import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Organizer } from '@src/domains/contacts/organizer/domain/organizer.entity';
import { OrganizerError } from '@src/domains/contacts/organizer/domain/organizer.errors';
import {
  ORGANIZER_REPOSITORY,
  OrganizerRepository,
} from '@src/domains/contacts/organizer/infrastructure/persistence/organizer.repository';
import { EntityID } from '@src/libs/ddd';
import { Ok, Result } from 'oxide.ts';
import { CreateOrganizerCommand } from './create-organizer.command';

@CommandHandler(CreateOrganizerCommand)
export class CreateOrganizerService implements ICommandHandler {
  private logger: Logger = new Logger(CreateOrganizerService.name);

  constructor(
    @Inject(ORGANIZER_REPOSITORY)
    private organizerRepository: OrganizerRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(
    command: CreateOrganizerCommand,
  ): Promise<Result<EntityID, OrganizerError>> {
    const { bookerId, name, type, emails, phones, contactIds } = command;

    const organizerResult = await Organizer.create({
      bookerId,
      name,
      type,
      emails,
      phones,
      contactIds,
    });

    if (organizerResult.isErr()) {
      return organizerResult;
    }

    const organizer = organizerResult.unwrap();
    await this.organizerRepository.save(organizer);

    await organizer.publishDomainEvents(this.logger, this.eventEmitter);

    return Ok(organizer.id);
  }
}
