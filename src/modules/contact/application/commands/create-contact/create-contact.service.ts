import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
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
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private contactRepository: ContactRepository,
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

    return Ok(contact.id);
  }
}
