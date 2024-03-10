import { Command, CommandProps, EntityID } from '@src/libs/ddd';
import { UserId } from '../../../domain/authentication.entity';

export class CreateAuthenticationCommand extends Command {
  readonly bookerId: EntityID;
  readonly userId: UserId;

  constructor(props: CommandProps<CreateAuthenticationCommand>) {
    super(props);

    this.bookerId = props.bookerId;
    this.userId = props.userId;
  }
}
