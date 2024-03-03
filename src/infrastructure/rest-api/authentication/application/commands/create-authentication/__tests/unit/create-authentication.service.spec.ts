import {
  EventEmitter2,
  EventEmitterModule,
  OnEvent,
} from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationAlreadyExistsError } from '@src/infrastructure/rest-api/authentication/domain/authentication.errors';
import { Argon2PasswordManager } from '@src/infrastructure/rest-api/authentication/infrastructure/argon2-password-manager';
import { AuthenticationInMemoryRepository } from '@src/infrastructure/rest-api/authentication/infrastructure/database/authentication.in-memory.repository';
import { EntityID } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { Result } from 'oxide.ts';
import { AUTHENTICATION_REPOSITORY } from '../../../../ports/authentication.repository.port';
import { PASSWORD_MANAGER } from '../../../../ports/password-manager.port';
import { CreateAuthenticationCommand } from '../../create-authentication.command';
import { CreateAuthenticationService } from '../../create-authentication.service';
import { AuthenticationCreatedEvent } from './../../../../../domain/events/authentication-created.event';

class EventHandlerMock {
  @OnEvent(AuthenticationCreatedEvent.name)
  handleEvent() {}
}

describe('CreateAuthenticationService Unit Tests', () => {
  let service: CreateAuthenticationService;
  let repository: AuthenticationInMemoryRepository;

  let eventEmitter: EventEmitter2;
  let eventHandler: EventHandlerMock;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],

      providers: [
        {
          provide: AUTHENTICATION_REPOSITORY,
          useClass: AuthenticationInMemoryRepository,
        },

        {
          provide: PASSWORD_MANAGER,
          useClass: Argon2PasswordManager,
        },

        CreateAuthenticationService,
        EventHandlerMock,
      ],
    }).compile();
    await module.init();

    service = module.get<CreateAuthenticationService>(
      CreateAuthenticationService,
    );
    repository = module.get<AuthenticationInMemoryRepository>(
      AUTHENTICATION_REPOSITORY,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    eventHandler = module.get<EventHandlerMock>(EventHandlerMock);
  });

  beforeEach(() => {
    repository.authentications = [];
  });

  it('should create a new Authentication', async () => {
    // Arrange
    const authCount = repository.authentications.length;
    const authDatas = new CreateAuthenticationCommand({
      email: 'test@mail.com',
      password: '$strongPassw0rd;',
      bookerId: randomUUID(),
    });
    const eventHandlerSpy = jest.spyOn(eventHandler, 'handleEvent');

    // Act
    const result: Result<EntityID, AuthenticationAlreadyExistsError> =
      await service.execute(authDatas);

    // Assert
    expect(result.isOk()).toBe(true);
    const id = result.unwrap();
    expect(id).not.toBeNull();
    expect(repository.authentications.length).toBe(authCount + 1);
    expect(eventEmitter.hasListeners(AuthenticationCreatedEvent.name)).toBe(
      true,
    );
    expect(eventHandlerSpy).toHaveBeenCalledTimes(1);
    eventHandlerSpy.mockRestore();
  });

  it('should hash the password when creating Authentication', async () => {
    const password = '$strongPassw0rd';
    const authDatas = new CreateAuthenticationCommand({
      email: 'test@mail.com',
      password,
      bookerId: randomUUID(),
    });

    const result: Result<EntityID, AuthenticationAlreadyExistsError> =
      await service.execute(authDatas);
    const id = result.unwrap();

    const authentication = repository.authentications.find(
      (auth) => auth.id === id,
    );
    expect(authentication!.password).not.toBe(password);
  });
});
