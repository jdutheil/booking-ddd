import { ContactPhone } from '@src/domains/contacts/contact/domain/contact.entity';
import { ContactName } from '@src/domains/contacts/contact/domain/value-objects/contact-name';
import { Email } from '@src/domains/contacts/shared/domain/value-objects/email';
import { Command, CommandProps, EntityID } from '@src/libs/ddd';
import { Option } from 'oxide.ts';

export class CreateContactCommand extends Command {
  bookerId: EntityID;
  name: Option<ContactName>;
  email: Option<Email>;
  phone: Option<ContactPhone>;

  constructor(props: CommandProps<CreateContactCommand>) {
    super(props);

    this.bookerId = props.bookerId;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
  }
}
