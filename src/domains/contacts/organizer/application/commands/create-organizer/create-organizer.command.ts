import { OrganizerName } from '@src/domains/contacts/organizer/domain/organizer.entity';
import { Command, CommandProps, EntityID } from '@src/libs/ddd';

export class CreateOrganizerCommand extends Command {
  bookerId: EntityID;
  name: OrganizerName;
  contactIds: EntityID[];

  constructor(props: CommandProps<CreateOrganizerCommand>) {
    super(props);

    this.bookerId = props.bookerId;
    this.name = props.name;
    this.contactIds = props.contactIds;
  }
}
