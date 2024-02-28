import { Command, CommandProps } from '@src/libs/ddd';
import { Option } from 'oxide.ts';

export class CreateContactCommand extends Command {
  firstName: Option<string>;
  lastName: Option<string>;
  email: Option<string>;
  phone: Option<string>;

  constructor(props: CommandProps<CreateContactCommand>) {
    super(props);

    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone;
  }
}
