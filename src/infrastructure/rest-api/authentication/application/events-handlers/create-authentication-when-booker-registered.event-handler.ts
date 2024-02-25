import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { BookerRegisteredEvent } from '@src/modules/booker/domain/events/booker-registered.event';
import { CreateAuthenticationCommand } from '../commands/create-authentication/create-authentication.command';

@Injectable()
export class CreateAuthenticationWhenBookerRegisteredEventHandler {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(BookerRegisteredEvent.eventName)
  async handle(event: BookerRegisteredEvent) {
    const command = new CreateAuthenticationCommand({
      bookerId: event.id,
      email: event.email,
      password: event.password,
    });

    await this.commandBus.execute(command);
  }
}
