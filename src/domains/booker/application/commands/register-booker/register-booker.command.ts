import { BookerEmail } from '@src/domains/booker/domain/value-objects/booker-email';
import { Command, CommandProps } from '@src/libs/ddd';

export class RegisterBookerCommand extends Command {
  readonly email: BookerEmail;

  constructor(props: CommandProps<RegisterBookerCommand>) {
    super(props);
    this.email = props.email;
  }
}
