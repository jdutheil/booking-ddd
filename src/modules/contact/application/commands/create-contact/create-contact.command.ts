import { Command, CommandProps, EntityID } from '@src/libs/ddd';
import { ContactName } from '@src/modules/contact/domain/value-objects/contact-name';
import { Option } from 'oxide.ts';

export class CreateContactCommand extends Command {
  bookerId: EntityID;
  name: Option<ContactName>;
  email: Option<string>;
  phone: Option<string>;

  constructor(props: CommandProps<CreateContactCommand>) {
    super(props);

    this.bookerId = props.bookerId;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
  }
}
