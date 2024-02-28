import { Guard } from '@src/libs/core/guard';
import { AggregateRoot, EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { ContactError } from './contact.errors';
import { ContactCreatedEvent } from './events/contact-created.event';
import { ContactEmail } from './value-objects/contact-email';

type FirstName = string;
type LastName = string;
type Phone = string;

export interface ContactProps {
  firstName: FirstName;
  lastName: LastName;
  email: ContactEmail;
  phone: Phone;
}

export class Contact extends AggregateRoot<ContactProps> {
  private constructor(props: ContactProps, id?: EntityID) {
    super(props, id);
  }

  static async create(
    props: ContactProps,
    id?: EntityID,
  ): Promise<Result<Contact, ContactError>> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.email, argumentName: 'email' },
      { argument: props.firstName, argumentName: 'firstname' },
      { argument: props.lastName, argumentName: 'lastname' },
      { argument: props.phone, argumentName: 'phone' },
    ]);
    if (guardResult.isErr()) {
      return Err(new ContactError(guardResult.unwrapErr()));
    }

    const isNew = !id;
    const contact = new Contact(props, id);

    if (isNew) {
      contact.addDomainEvent(new ContactCreatedEvent(contact));
    }

    return Ok(contact);
  }
}
