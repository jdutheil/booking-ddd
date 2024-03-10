import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import {
  AUTHENTICATION_REPOSITORY,
  AuthenticationRepository,
} from '../../../application/ports/authentication.repository.port';
import { Authentication } from '../../../domain/authentication.entity';
import {
  AuthenticationAlreadyExistsError,
  AuthenticationError,
} from '../../../domain/authentication.errors';
import { CreateAuthenticationCommand } from './create-authentication.command';

@CommandHandler(CreateAuthenticationCommand)
export class CreateAuthenticationService implements ICommandHandler {
  private logger: Logger = new Logger(CreateAuthenticationService.name);

  constructor(
    @Inject(AUTHENTICATION_REPOSITORY)
    private authenticationRepository: AuthenticationRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(
    command: CreateAuthenticationCommand,
  ): Promise<
    Result<EntityID, AuthenticationAlreadyExistsError | AuthenticationError>
  > {
    const authenticationResult = await Authentication.create({
      bookerId: command.bookerId,
      userId: command.userId,
    });

    if (authenticationResult.isErr()) {
      return Err<AuthenticationError>(
        new AuthenticationError(authenticationResult.unwrapErr().message),
      );
    }

    const authentication = authenticationResult.unwrap();

    try {
      await this.authenticationRepository.save(authentication);
    } catch (error) {
      if (error instanceof AuthenticationAlreadyExistsError) {
        return Err(error);
      }

      throw error;
    }

    authentication.publishDomainEvents(this.logger, this.eventEmitter);

    return Ok(authentication.id);
  }
}
