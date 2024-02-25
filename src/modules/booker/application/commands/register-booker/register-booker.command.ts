import { Command, CommandProps } from '@src/libs/ddd';

export class RegisterBookerCommand extends Command {
  readonly email: string;

  constructor(props: CommandProps<RegisterBookerCommand>) {
    super(props);
    this.email = props.email;
  }
}
