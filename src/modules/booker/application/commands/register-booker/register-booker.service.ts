import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityID } from '@src/libs/ddd';
import { BookerEntity } from '@src/modules/booker/domain/booker.entity';
import { BookerAlreadyExistsError } from '@src/modules/booker/domain/booker.errors';
import {
  BOOKER_REPOSITORY,
  BookerRepositoryPort,
} from '@src/modules/booker/infrastructure/persistence/booker.repository.port';
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
  ): Promise<Result<EntityID, BookerAlreadyExistsError>> {
    const booker = await BookerEntity.create({ email: command.email });

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
