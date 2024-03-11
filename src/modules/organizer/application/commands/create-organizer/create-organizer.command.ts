import { Command, CommandProps, EntityID } from '@src/libs/ddd';
import { OrganizerName } from '@src/modules/organizer/domain/organizer.entity';

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
