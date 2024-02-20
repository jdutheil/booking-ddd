import { Command, CommandProps } from '@src/libs/ddd';

export class CreateBookerCommand extends Command {
  readonly email: string;
  readonly password: string;

  constructor(props: CommandProps<CreateBookerCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
  }
}
