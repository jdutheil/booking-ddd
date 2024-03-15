import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Booker } from '@src/domains/booker/domain/booker.entity';
import {
  BookerAlreadyExistsError,
  BookerError,
} from '@src/domains/booker/domain/booker.errors';
import {
  BOOKER_REPOSITORY,
  BookerRepositoryPort,
} from '@src/domains/booker/infrastructure/persistence/booker.repository.port';
import { EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { RegisterBookerCommand } from './register-booker.command';

@CommandHandler(RegisterBookerCommand)
export class RegisterBookerService implements ICommandHandler {
  constructor(
    @Inject(BOOKER_REPOSITORY)
    private bookerRepository: BookerRepositoryPort,
  ) {}

  async execute(
    command: RegisterBookerCommand,
  ): Promise<Result<EntityID, BookerAlreadyExistsError | BookerError>> {
    const bookerResult = Booker.create({ email: command.email });
    if (bookerResult.isErr()) {
      return Err(new BookerError(bookerResult.unwrapErr().message));
    }

    const booker = bookerResult.unwrap();

    try {
      await this.bookerRepository.register(booker);
    } catch (error: unknown) {
      if (error instanceof BookerAlreadyExistsError) {
        return Err(error);
      }

      throw error;
    }

    return Ok(booker.id);
  }
}
