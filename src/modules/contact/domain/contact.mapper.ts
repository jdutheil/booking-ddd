import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd';
import { None, Some } from 'oxide.ts';
import {
  ContactModel,
  contactSchema,
} from '../infrastructure/persistence/contact.model';
import { Contact } from './contact.entity';
import { ContactError } from './contact.errors';
import { ContactEmail } from './value-objects/contact-email';
import { ContactName } from './value-objects/contact-name';

@Injectable()
export class ContactMapper implements Mapper<Contact, ContactModel> {
  toDomain(record: ContactModel): Contact {
    const result = Contact.create(
      {
        bookerId: record.bookerId,
        name:
          record.firstName || record.lastName
            ? Some(
                ContactName.create({
                  firstName: record.firstName ? Some(record.firstName) : None,
                  lastName: record.lastName ? Some(record.lastName) : None,
                }).unwrap(),
              )
            : None,
        email: record.email
          ? Some(ContactEmail.create(record.email).unwrap())
          : None,
        phone: record.phone ? Some(record.phone) : None,
      },
      record.id,
    );

    if (result.isErr()) {
      throw new ContactError(
        'An error occured during Contact mapping',
        result.unwrapErr(),
      );
    }

    return result.unwrap();
  }

  toPersistence(entity: Contact): ContactModel {
    const record: ContactModel = {
      id: entity.id,
      bookerId: entity.bookerId,
      firstName: entity.name.isSome()
        ? entity.name.unwrap().firstName.isSome()
          ? entity.name.unwrap().firstName.unwrap()
          : null
        : null,
      lastName: entity.name.isSome()
        ? entity.name.unwrap().lastName.isSome()
          ? entity.name.unwrap().lastName.unwrap()
          : null
        : null,
      email: entity.email.isSome() ? entity.email.unwrap().value : null,
      phone: entity.phone.isSome() ? entity.phone.unwrap() : null,
    };

    return contactSchema.parse(record);
  }
}
