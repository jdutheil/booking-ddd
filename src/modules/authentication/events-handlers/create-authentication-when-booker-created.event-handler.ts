import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { BookerCreatedEvent } from '@src/modules/booker/domain/events/booker-created.event';
import { CreateAuthenticationCommand } from '../commands/create-authentication/create-authentication.command';

@Injectable()
export class CreateAuthenticationWhenBookerCreatedEventHandler {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(BookerCreatedEvent.eventName)
  async handle(event: BookerCreatedEvent) {
    const command = new CreateAuthenticationCommand({
      bookerId: event.id,
      email: 'todo@gmail.com',
      password: 'password',
    });

    await this.commandBus.execute(command);
  }
}
