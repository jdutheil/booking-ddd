import { Command, CommandProps } from '@src/libs/ddd';

export class CreateBookerCommand extends Command {
  readonly email: string;

  constructor(props: CommandProps<CreateBookerCommand>) {
    super(props);
    this.email = props.email;
  }
}
