import { Email } from '@clerk/clerk-sdk-node';
import { Entity, EntityID } from '@src/libs/ddd';
import { None, Ok, Option, Result } from 'oxide.ts';
import { ContactInfosError } from './contact-infos.errors';
import { Address } from './value-objects/address';
import { Website } from './value-objects/website';

export type Emails = Email[];
export type Phones = string[];

export interface ContactInfosProps {
  emails: Emails;
  phones: Phones;
  website: Option<Website>;
  address: Option<Address>;
}

export class ContactInfos extends Entity<ContactInfosProps> {
  get emails(): Emails {
    return this.props.emails;
  }

  get phones(): Phones {
    return this.props.phones;
  }

  get website(): Option<Website> {
    return this.props.website;
  }

  get address(): Option<Address> {
    return this.props.address;
  }

  private constructor(props: ContactInfosProps, id?: EntityID) {
    super(props, id);
  }

  static create(
    props: ContactInfosProps,
    id?: EntityID,
  ): Result<ContactInfos, ContactInfosError> {
    const contactInfos = new ContactInfos(
      {
        emails: props.emails ?? [],
        phones: props.phones ?? [],
        website: props.website ?? None,
        address: props.address ?? None,
      },
      id,
    );

    return Ok(contactInfos);
  }
}
