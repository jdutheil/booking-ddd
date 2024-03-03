import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityID } from '@src/libs/ddd';
import { Contact } from '@src/modules/contact/domain/contact.entity';
import {
  ContactEmailAlreadyExistsError,
  ContactError,
} from '@src/modules/contact/domain/contact.errors';
import {
  CONTACT_REPOSITORY,
  ContactRepository,
} from '@src/modules/contact/infrastructure/persistence/contact.repository';
import { Err, Ok, Result } from 'oxide.ts';
import { CreateContactCommand } from './create-contact.command';

@CommandHandler(CreateContactCommand)
export class CreateContactService implements ICommandHandler {
  private logger: Logger = new Logger(CreateContactService.name);

  constructor(
    @Inject(CONTACT_REPOSITORY)
    private contactRepository: ContactRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(
    command: CreateContactCommand,
  ): Promise<Result<EntityID, ContactError>> {
    const { bookerId, name, email, phone } = command;

    if (email.isSome()) {
      const emailExists = await this.contactRepository.emailExistsForBooker(
        email.unwrap().value,
        bookerId,
      );
      if (emailExists) {
        return Err(new ContactEmailAlreadyExistsError(email));
      }
    }

    const contactResult = await Contact.create({
      bookerId,
      name,
      email,
      phone,
    });

    if (contactResult.isErr()) {
      return Err(contactResult.unwrapErr());
    }

    const contact = contactResult.unwrap();
    await this.contactRepository.save(contact);

    await contact.publishDomainEvents(this.logger, this.eventEmitter);

    return Ok(contact.id);
  }
}
