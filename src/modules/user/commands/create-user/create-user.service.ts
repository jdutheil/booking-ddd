import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../domain/user.entity';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  async execute(command: CreateUserCommand): Promise<UserEntity> {
    return UserEntity.create({
      email: command.email,
      password: command.password,
    });
  }
}
