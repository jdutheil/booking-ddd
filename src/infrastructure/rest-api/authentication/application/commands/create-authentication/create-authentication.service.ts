import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityID } from '@src/libs/ddd';
import { Err, None, Ok, Result } from 'oxide.ts';
import {
  AUTHENTICATION_REPOSITORY,
  AuthenticationRepositoryPort,
} from '../../../application/ports/authentication.repository.port';
import {
  PASSWORD_MANAGER,
  PasswordManagerPort,
} from '../../../application/ports/password-manager.port';
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
    private authenticationRepository: AuthenticationRepositoryPort,
    @Inject(PASSWORD_MANAGER)
    private passwordManager: PasswordManagerPort,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(
    command: CreateAuthenticationCommand,
  ): Promise<
    Result<EntityID, AuthenticationAlreadyExistsError | AuthenticationError>
  > {
    const authenticationResult = await Authentication.create({
      bookerId: command.bookerId,
      email: command.email,
      password: await this.passwordManager.hashPassword(command.password),
      accessToken: None,
      refreshToken: None,
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
