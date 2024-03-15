import { Guard } from '@src/libs/core/guard';
import { AggregateRoot, EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { Email } from '../../shared/domain/value-objects/email';
import { OrganizerCreatedEvent } from './events/organizer-created.event';
import { OrganizerError } from './organizer.errors';

export type OrganizerName = string;
export type ContactIds = EntityID[];
export type OrganizerEmails = Email[];
export type OrganizerPhones = string[];

export enum OrganizerType {
  CITY_HALL = 'CITY_HALL',
  TOURIST_OFFICE = 'TOURIST_OFFICE',
  ASSOCIATION = 'ASSOCIATION',
  OTHER = 'OTHER',
}

export interface OrganizerProps {
  bookerId: EntityID;
  name: OrganizerName;
  type: OrganizerType;
  emails: OrganizerEmails;
  phones: OrganizerPhones;
  contactIds: ContactIds;
}

export class Organizer extends AggregateRoot<OrganizerProps> {
  get bookerId(): EntityID {
    return this.props.bookerId;
  }

  get name(): OrganizerName {
    return this.props.name;
  }

  public changeName(name: OrganizerName): void {
    this.props.name = name;
  }

  get type(): OrganizerType {
    return this.props.type;
  }

  get emails(): OrganizerEmails {
    return this.props.emails;
  }

  public addEmail(email: Email): void {
    const emailExists = this.props.emails.some((existingEmail) => {
      return existingEmail.equals(email);
    });
    if (emailExists) {
      return;
    }

    this.props.emails.push(email);
  }

  public removeEmail(email: Email): void {
    this.props.emails = this.props.emails.filter((existingEmail) => {
      return !existingEmail.equals(email);
    });
  }

  get phones(): OrganizerPhones {
    return this.props.phones;
  }

  public addPhone(phone: string): void {
    const phoneExists = this.props.phones.some((existingPhone) => {
      return existingPhone === phone;
    });
    if (phoneExists) {
      return;
    }

    this.props.phones.push(phone);
  }

  public removePhone(phone: string): void {
    this.props.phones = this.props.phones.filter((existingPhone) => {
      return existingPhone !== phone;
    });
  }

  get contactIds(): ContactIds {
    return this.props.contactIds;
  }

  private constructor(props: OrganizerProps, id?: EntityID) {
    super(props, id);
  }

  static create(
    props: OrganizerProps,
    id?: EntityID,
  ): Result<Organizer, OrganizerError> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.bookerId, argumentName: 'bookerId' },
      { argument: props.name, argumentName: 'name' },
      { argument: props.type, argumentName: 'type' },
    ]);
    if (guardResult.isErr()) {
      return guardResult.mapErr((error) => new OrganizerError(error));
    }

    if (this.nameIsEmpty(props.name)) {
      return Err(new OrganizerError('Name cannot be empty'));
    }
    if (this.nameIsTooLong(props.name)) {
      return Err(
        new OrganizerError('Name cannot be longer than 255 characters'),
      );
    }

    const isNew = !id;
    const organizer = new Organizer(
      {
        ...props,
        emails: props.emails ? props.emails : [],
        phones: props.phones ? props.phones : [],
        contactIds: props.contactIds ? props.contactIds : [],
      },
      id,
    );

    if (isNew) {
      organizer.addDomainEvent(new OrganizerCreatedEvent(organizer));
    }

    return Ok(organizer);
  }

  private static nameIsEmpty(name: OrganizerName): boolean {
    return name.trim() === '';
  }

  private static nameIsTooLong(name: OrganizerName): boolean {
    return name.length > 255;
  }
}
