import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { UserEntity } from '../../domain/user.entity';
import { UserAlreadyExistsError } from '../../domain/user.errors';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  private users: UserEntity[] = [];

  async execute(
    command: CreateUserCommand,
  ): Promise<Result<AggregateID, UserAlreadyExistsError>> {
    const user = await UserEntity.create({
      email: command.email,
      password: command.password,
    });

    if (this.users.find((u) => u.email === user.email)) {
      return Err(new UserAlreadyExistsError());
    }

    this.users.push(user);
    return Ok(user.id);
  }
}
