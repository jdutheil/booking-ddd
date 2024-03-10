import {
  EventEmitter2,
  EventEmitterModule,
  OnEvent,
} from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationAlreadyExistsError } from '@src/infrastructure/rest-api/authentication/domain/authentication.errors';
import { AuthenticationInMemoryRepository } from '@src/infrastructure/rest-api/authentication/infrastructure/database/authentication.in-memory.repository';
import { EntityID } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { Result } from 'oxide.ts';
import { AUTHENTICATION_REPOSITORY } from '../../../../ports/authentication.repository.port';
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
      bookerId: randomUUID(),
      userId: randomUUID(),
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
});
