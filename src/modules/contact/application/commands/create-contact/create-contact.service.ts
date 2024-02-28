import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityID } from '@src/libs/ddd';
import { ContactError } from '@src/modules/contact/domain/contact.errors';
import {
  CONTACT_REPOSITORY,
  ContactRepository,
} from '@src/modules/contact/infrastructure/persistence/contact.repository';
import { Result } from 'oxide.ts';
import { CreateContactCommand } from './create-contact.command';

@CommandHandler(CreateContactCommand)
export class CreateContactService implements ICommandHandler {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private contactRepository: ContactRepository,
  ) {}

  async execute(
    command: CreateContactCommand,
  ): Promise<Result<EntityID, ContactError>> {
    throw new Error('Method not implemented.');
  }
}
