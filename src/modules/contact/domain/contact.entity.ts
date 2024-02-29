import { Guard } from '@src/libs/core/guard';
import { AggregateRoot, EntityID } from '@src/libs/ddd';
import { Err, Ok, Option, Result } from 'oxide.ts';
import { ContactError } from './contact.errors';
import { ContactCreatedEvent } from './events/contact-created.event';
import { ContactEmail } from './value-objects/contact-email';
import { ContactName } from './value-objects/contact-name';

type Phone = string;

export interface ContactProps {
  bookerId: EntityID;
  name: Option<ContactName>;
  email: Option<ContactEmail>;
  phone: Option<Phone>;
}

export class Contact extends AggregateRoot<ContactProps> {
  get name(): Option<ContactName> {
    return this.props.name;
  }

  get email(): Option<ContactEmail> {
    return this.props.email;
  }

  get phone(): Option<Phone> {
    return this.props.phone;
  }

  private constructor(props: ContactProps, id?: EntityID) {
    super(props, id);
  }

  static create(
    props: ContactProps,
    id?: EntityID,
  ): Result<Contact, ContactError> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.bookerId, argumentName: 'bookerId' },
      { argument: props.email, argumentName: 'email' },
      { argument: props.name, argumentName: 'name' },
      { argument: props.phone, argumentName: 'phone' },
    ]);
    if (guardResult.isErr()) {
      return Err(new ContactError(guardResult.unwrapErr()));
    }

    if (this.nameAndEmailAreNone(props.name, props.email)) {
      return Err(new ContactError('Name and email cannot be both empty'));
    }

    const isNew = !id;
    const contact = new Contact(props, id);

    if (isNew) {
      contact.addDomainEvent(new ContactCreatedEvent(contact));
    }

    return Ok(contact);
  }

  private static nameAndEmailAreNone(
    name: Option<ContactName>,
    email: Option<ContactEmail>,
  ): boolean {
    return name.isNone() && email.isNone();
  }

  public updateName(name: Option<ContactName>): void {
    this.props.name = name;
  }

  public updateEmail(email: Option<ContactEmail>): void {
    this.props.email = email;
  }

  public updatePhone(phone: Option<Phone>): void {
    this.props.phone = phone;
  }
}
