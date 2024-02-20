import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAuthenticationCommand } from './create-authentication.command';

@CommandHandler(CreateAuthenticationCommand)
export class CreateAuthenticationService implements ICommandHandler {
  async execute(command: CreateAuthenticationCommand): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
