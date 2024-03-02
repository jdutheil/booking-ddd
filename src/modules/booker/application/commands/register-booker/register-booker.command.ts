import { Command, CommandProps } from '@src/libs/ddd';
import { BookerEmail } from '@src/modules/booker/domain/value-objects/booker-email';

export class RegisterBookerCommand extends Command {
  readonly email: BookerEmail;

  constructor(props: CommandProps<RegisterBookerCommand>) {
    super(props);
    this.email = props.email;
  }
}
