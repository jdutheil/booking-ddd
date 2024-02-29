import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityID } from '@src/libs/ddd';
import { Contact } from '@src/modules/contact/domain/contact.entity';
import {
  ContactEmailAlreadyExistsError,
  ContactError,
} from '@src/modules/contact/domain/contact.errors';
import { ContactEmail } from '@src/modules/contact/domain/value-objects/contact-email';
import { ContactName } from '@src/modules/contact/domain/value-objects/contact-name';
import {
  CONTACT_REPOSITORY,
  ContactRepository,
} from '@src/modules/contact/infrastructure/persistence/contact.repository';
import { Err, None, Ok, Result, Some } from 'oxide.ts';
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
    const { firstName, lastName, email, phone } = command;

    if (email.isSome()) {
      const emailExists = await this.contactRepository.emailExists(
        email.unwrap(),
      );
      if (emailExists) {
        return Err(new ContactEmailAlreadyExistsError(email));
      }
    }

    const contactResult = await Contact.create({
      name: ContactName.create({
        firstName,
        lastName,
      }).unwrap(),
      email: email.isSome()
        ? Some(ContactEmail.create(email.unwrap()).unwrap())
        : None,
      phone: phone.isSome() ? Some(phone.unwrap()) : None,
    });

    if (contactResult.isErr()) {
      return Err(contactResult.unwrapErr());
    }

    const contact = contactResult.unwrap();
    await this.contactRepository.save(contact);

    return Ok(contact.id);
  }
}
