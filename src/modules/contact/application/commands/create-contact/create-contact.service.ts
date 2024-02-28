import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityID } from '@src/libs/ddd';
import { ContactError } from '@src/modules/contact/domain/contact.errors';
import { Result } from 'oxide.ts';
import { CreateContactCommand } from './create-contact.command';

@CommandHandler(CreateContactCommand)
export class CreateContactService implements ICommandHandler {
  async execute(
    command: CreateContactCommand,
  ): Promise<Result<EntityID, ContactError>> {
    throw new Error('Method not implemented.');
  }
}
