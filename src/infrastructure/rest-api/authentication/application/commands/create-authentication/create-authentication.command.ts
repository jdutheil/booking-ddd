import { Command, CommandProps } from '@src/libs/ddd';

export class CreateAuthenticationCommand extends Command {
  readonly bookerId: string;
  readonly email: string;
  readonly password: string;

  constructor(props: CommandProps<CreateAuthenticationCommand>) {
    super(props);

    this.bookerId = props.bookerId;
    this.email = props.email;
    this.password = props.password;
  }
}
