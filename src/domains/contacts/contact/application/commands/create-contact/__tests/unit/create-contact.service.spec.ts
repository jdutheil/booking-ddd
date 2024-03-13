import {
  EventEmitter2,
  EventEmitterModule,
  OnEvent,
} from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { Contact } from '@src/domains/contacts/contact/domain/contact.entity';
import { ContactEmailAlreadyExistsError } from '@src/domains/contacts/contact/domain/contact.errors';
import { ContactCreatedEvent } from '@src/domains/contacts/contact/domain/events/contact-created.event';
import { ContactEmail } from '@src/domains/contacts/contact/domain/value-objects/contact-email';
import { ContactName } from '@src/domains/contacts/contact/domain/value-objects/contact-name';
import { ContactInMemoryRepository } from '@src/domains/contacts/contact/infrastructure/persistence/contact.in-memory.repository';
import { CONTACT_REPOSITORY } from '@src/domains/contacts/contact/infrastructure/persistence/contact.repository';
import { randomUUID } from 'crypto';
import { Option } from 'oxide.ts';
import { CreateContactCommand } from '../../create-contact.command';
import { CreateContactService } from '../../create-contact.service';

class EventHandlerMock {
  @OnEvent(ContactCreatedEvent.name)
  handleEvent() {}
}

describe('Create Contact Service', () => {
  let service: CreateContactService;
  let repository: ContactInMemoryRepository;

  let eventEmitter: EventEmitter2;
  let eventHandler: EventHandlerMock;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],

      providers: [
        CreateContactService,

        {
          provide: CONTACT_REPOSITORY,
          useClass: ContactInMemoryRepository,
        },

        EventHandlerMock,
      ],
    }).compile();
    await module.init();

    service = module.get<CreateContactService>(CreateContactService);
    repository = module.get<ContactInMemoryRepository>(CONTACT_REPOSITORY);

    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    eventHandler = module.get<EventHandlerMock>(EventHandlerMock);
  });

  describe('execute', () => {
    beforeEach(() => {
      repository.contacts = [];
    });

    it('should return an error if email already exists', async () => {
      const existingEmail = 'john.doe@mail.com';

      // Arrange
      const existingContactResult = await Contact.create({
        bookerId: randomUUID(),
        name: Option.from(
          ContactName.create({
            firstName: Option.from('John'),
            lastName: Option.from('Doe'),
          }).unwrap(),
        ),
        email: Option.from(ContactEmail.create(existingEmail).unwrap()),
        phone: Option.from('111'),
      });
      const existingContact = existingContactResult.unwrap();
      await repository.save(existingContact);

      const command = new CreateContactCommand({
        bookerId: existingContact.bookerId,
        name: Option.from(
          ContactName.create({
            firstName: Option.from('Jane'),
            lastName: Option.from('Dine'),
          }).unwrap(),
        ),
        email: existingContact.email,
        phone: Option.from('00'),
      });

      // Act
      const result = await service.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(ContactEmailAlreadyExistsError);
    });

    it('should create a new contact and emit ContactCreated event', async () => {
      // Arrange
      const command = new CreateContactCommand({
        bookerId: randomUUID(),
        name: Option.from(
          ContactName.create({
            firstName: Option.from('John'),
            lastName: Option.from('Doe'),
          }).unwrap(),
        ),
        email: Option.from(ContactEmail.create('john.doe@mail.com').unwrap()),
        phone: Option.from('1234567890'),
      });
      const contactsCount = repository.contacts.length;
      const eventHandlerSpy = jest.spyOn(eventHandler, 'handleEvent');

      // Act
      const result = await service.execute(command);

      // Assert
      expect(result.isOk()).toBe(true);
      expect(repository.contacts.length).toBe(contactsCount + 1);
      const contactId = result.unwrap();
      expect(contactId).toBeDefined();
      expect(contactId).not.toBeNull();

      // Test event
      expect(eventEmitter.hasListeners(ContactCreatedEvent.name)).toBe(true);
      expect(eventHandlerSpy).toHaveBeenCalledTimes(1);
      eventHandlerSpy.mockRestore();
    });
  });
});
