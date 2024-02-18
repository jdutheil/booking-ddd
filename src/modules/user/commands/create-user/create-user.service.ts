import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../database/user.repository.port';
import { UserEntity } from '../../domain/user.entity';
import { UserAlreadyExistsError } from '../../domain/user.errors';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<Result<AggregateID, UserAlreadyExistsError>> {
    const user = await UserEntity.create({
      email: command.email,
      password: command.password,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return Err(error);
      }

      throw error;
    }

    return Ok(user.id);
  }
}
