import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AggregateID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import {
  BookerRepositoryPort,
  USER_REPOSITORY,
} from '../../database/booker.repository.port';
import { BookerEntity } from '../../domain/booker.entity';
import { BookerAlreadyExistsError } from '../../domain/booker.errors';
import { BookerCreatedEvent } from '../../domain/events/booker-created.event';
import { CreateBookerCommand } from './create-booker.command';

@CommandHandler(CreateBookerCommand)
export class CreateBookerService implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private bookerRepository: BookerRepositoryPort,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(
    command: CreateBookerCommand,
  ): Promise<Result<AggregateID, BookerAlreadyExistsError>> {
    const booker = await BookerEntity.create({
      email: command.email,
    });

    try {
      await this.bookerRepository.save(booker);
    } catch (error) {
      if (error instanceof BookerAlreadyExistsError) {
        return Err(error);
      }

      throw error;
    }

    this.eventEmitter.emit(
      BookerCreatedEvent.eventName,
      new BookerCreatedEvent({
        id: booker.id,
        email: booker.email,
        password: command.password,
      }),
    );

    return Ok(booker.id);
  }
}
