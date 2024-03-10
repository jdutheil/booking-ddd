import { Guard } from '@src/libs/core/guard';
import { AggregateRoot, EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { OrganizerCreatedEvent } from './events/organizer-created.event';
import { OrganizerError } from './organizer.errors';

export type OrganizerName = string;
export type ContactIds = EntityID[];

export interface OrganizerProps {
  bookerId: EntityID;
  name: OrganizerName;
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
      { argument: props.contactIds, argumentName: 'contactIds' },
    ]);
    if (guardResult.isErr()) {
      return guardResult.mapErr((error) => new OrganizerError(error));
    }

    if (this.nameIsEmpty(props.name)) {
      return Err(new OrganizerError('Name cannot be empty'));
    }

    const isNew = !id;
    const organizer = new Organizer(props, id);

    if (isNew) {
      organizer.addDomainEvent(new OrganizerCreatedEvent(organizer));
    }

    return Ok(organizer);
  }

  private static nameIsEmpty(name: OrganizerName): boolean {
    return name.trim() === '';
  }
}
