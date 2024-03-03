import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { BookerRegisteredFromSignUpEvent } from '@src/infrastructure/rest-api/booker/domain/events/booker-registered-from-sign-up.event';
import { CreateAuthenticationCommand } from '../commands/create-authentication/create-authentication.command';

@Injectable()
export class CreateAuthenticationWhenBookerRegisteredEventHandler {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(BookerRegisteredFromSignUpEvent.name)
  async handle(event: BookerRegisteredFromSignUpEvent) {
    const command = new CreateAuthenticationCommand({
      bookerId: event.id,
      email: event.email,
      password: event.password,
    });

    await this.commandBus.execute(command);
  }
}
