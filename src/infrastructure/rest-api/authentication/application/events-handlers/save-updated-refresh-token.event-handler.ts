import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AUTHENTICATION_REPOSITORY,
  AuthenticationRepositoryPort,
} from '../../application/ports/authentication.repository.port';
import {
  PASSWORD_MANAGER,
  PasswordManagerPort,
} from '../../application/ports/password-manager.port';
import { AuthenticationNotFoundError } from '../../domain/authentication.errors';
import { RefreshTokenUpdatedEvent } from '../../domain/events/refresh-token-updated.event';

@Injectable()
export class SaveUpdatedRefreshTokenEventHandler {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(AUTHENTICATION_REPOSITORY)
    private readonly authenticationRepository: AuthenticationRepositoryPort,
    @Inject(PASSWORD_MANAGER)
    private readonly passwordManager: PasswordManagerPort,
  ) {}

  @OnEvent(RefreshTokenUpdatedEvent.eventName)
  async handle(event: RefreshTokenUpdatedEvent) {
    const { authenticationId, refreshToken } = event;

    const authentication =
      await this.authenticationRepository.findOneById(authenticationId);

    if (authentication.isNone()) {
      throw new AuthenticationNotFoundError();
    }

    const authenticationEntity = authentication.unwrap();
    const hashedRefreshToken =
      await this.passwordManager.hashPassword(refreshToken);
    authenticationEntity.refreshToken = hashedRefreshToken;

    await this.authenticationRepository.update(authenticationEntity);
  }
}
