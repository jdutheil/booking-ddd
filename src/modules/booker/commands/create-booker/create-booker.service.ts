import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import {
  BookerRepositoryPort,
  USER_REPOSITORY,
} from '../../database/booker.repository.port';
import { BookerEntity } from '../../domain/booker.entity';
import { BookerAlreadyExistsError } from '../../domain/booker.errors';
import { CreateBookerCommand } from './create-booker.command';

@CommandHandler(CreateBookerCommand)
export class CreateBookerService implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly bookerRepository: BookerRepositoryPort,
  ) {}

  async execute(
    command: CreateBookerCommand,
  ): Promise<Result<AggregateID, BookerAlreadyExistsError>> {
    const booker = await BookerEntity.create({
      email: command.email,
      password: command.password,
    });

    try {
      await this.bookerRepository.save(booker);
    } catch (error) {
      if (error instanceof BookerAlreadyExistsError) {
        return Err(error);
      }

      throw error;
    }

    return Ok(booker.id);
  }
}
