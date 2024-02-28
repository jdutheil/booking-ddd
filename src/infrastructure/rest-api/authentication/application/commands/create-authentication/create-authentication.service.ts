import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import {
  AUTHENTICATION_REPOSITORY,
  AuthenticationRepositoryPort,
} from '../../../application/ports/authentication.repository.port';
import {
  PASSWORD_MANAGER,
  PasswordManagerPort,
} from '../../../application/ports/password-manager.port';
import { AuthenticationEntity } from '../../../domain/authentication.entity';
import { AuthenticationAlreadyExistsError } from '../../../domain/authentication.errors';
import { CreateAuthenticationCommand } from './create-authentication.command';

@CommandHandler(CreateAuthenticationCommand)
export class CreateAuthenticationService implements ICommandHandler {
  constructor(
    @Inject(AUTHENTICATION_REPOSITORY)
    private readonly authenticationRepository: AuthenticationRepositoryPort,
    @Inject(PASSWORD_MANAGER)
    private readonly passwordManager: PasswordManagerPort,
  ) {}

  async execute(
    command: CreateAuthenticationCommand,
  ): Promise<Result<EntityID, AuthenticationAlreadyExistsError>> {
    const authentication = await AuthenticationEntity.create({
      bookerId: command.bookerId,
      email: command.email,
      password: await this.passwordManager.hashPassword(command.password),
    });

    try {
      await this.authenticationRepository.save(authentication);
    } catch (error) {
      if (error instanceof AuthenticationAlreadyExistsError) {
        return Err(error);
      }

      throw error;
    }

    return Ok(authentication.id);
  }
}
