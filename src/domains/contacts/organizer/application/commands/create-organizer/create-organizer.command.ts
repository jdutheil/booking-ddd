import {
  OrganizerEmails,
  OrganizerName,
  OrganizerPhones,
  OrganizerType,
} from '@src/domains/contacts/organizer/domain/organizer.entity';
import { Command, CommandProps, EntityID } from '@src/libs/ddd';

export class CreateOrganizerCommand extends Command {
  bookerId: EntityID;
  name: OrganizerName;
  type: OrganizerType;
  emails: OrganizerEmails;
  phones: OrganizerPhones;
  contactIds: EntityID[];

  constructor(props: CommandProps<CreateOrganizerCommand>) {
    super(props);

    this.bookerId = props.bookerId;
    this.name = props.name;
    this.type = props.type;
    this.emails = props.emails;
    this.phones = props.phones;
    this.contactIds = props.contactIds;
  }
}
