import { EventEmitterModule, OnEvent } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerCreatedEvent } from '@src/domains/contacts/organizer/domain/events/organizer-created.event';
import { OrganizerType } from '@src/domains/contacts/organizer/domain/organizer.entity';
import { OrganizerInMemoryRepository } from '@src/domains/contacts/organizer/infrastructure/persistence/organizer.in-memory.repository';
import { ORGANIZER_REPOSITORY } from '@src/domains/contacts/organizer/infrastructure/persistence/organizer.repository';
import { randomUUID } from 'node:crypto';
import { CreateOrganizerCommand } from '../../create-organizer.command';
import { CreateOrganizerService } from '../../create-organizer.service';

class EventHandlerMock {
  @OnEvent(OrganizerCreatedEvent.name)
  handleEvent() {}
}

describe('Create Organizer Service', () => {
  let service: CreateOrganizerService;
  let repository: OrganizerInMemoryRepository;

  let eventHandler: EventHandlerMock;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],

      providers: [
        CreateOrganizerService,

        {
          provide: ORGANIZER_REPOSITORY,
          useClass: OrganizerInMemoryRepository,
        },

        EventHandlerMock,
      ],
    }).compile();
    await module.init();

    service = module.get<CreateOrganizerService>(CreateOrganizerService);
    repository = module.get<OrganizerInMemoryRepository>(ORGANIZER_REPOSITORY);

    eventHandler = module.get<EventHandlerMock>(EventHandlerMock);
  });

  describe('execute', () => {
    afterEach(() => {
      repository.organizers = [];
    });

    it('should create a new organizer and emit OrganizerCreated event', async () => {
      // Arrange
      const command = new CreateOrganizerCommand({
        bookerId: randomUUID(),
        name: 'Organizer Name',
        type: OrganizerType.OTHER,
        emails: [],
        phones: [],
        contactIds: [],
      });
      const organizersCount = repository.organizers.length;
      const eventHandlerSpy = jest.spyOn(eventHandler, 'handleEvent');

      // Act
      const result = await service.execute(command);

      // Assert
      expect(result.isOk()).toBe(true);
      expect(repository.organizers.length).toBe(organizersCount + 1);
      expect(result.unwrap()).not.toBeNull();
      expect(eventHandlerSpy).toHaveBeenCalledTimes(1);
      eventHandlerSpy.mockRestore();
    });

    it('should return an error if organizer name is empty', async () => {
      // Arrange
      const command = new CreateOrganizerCommand({
        bookerId: randomUUID(),
        name: '',
        type: OrganizerType.OTHER,
        emails: [],
        phones: [],
        contactIds: [],
      });

      // Act
      const result = await service.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
    });

    it('should return an error if organizer name is too long', async () => {
      // Arrange
      const command = new CreateOrganizerCommand({
        bookerId: randomUUID(),
        name: 'a'.repeat(256),
        type: OrganizerType.OTHER,
        emails: [],
        phones: [],
        contactIds: [],
      });

      // Act
      const result = await service.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
    });
  });
});
