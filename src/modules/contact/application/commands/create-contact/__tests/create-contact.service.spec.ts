import { Test, TestingModule } from '@nestjs/testing';
import { Contact } from '@src/modules/contact/domain/contact.entity';
import { ContactEmailAlreadyExistsError } from '@src/modules/contact/domain/contact.errors';
import { ContactEmail } from '@src/modules/contact/domain/value-objects/contact-email';
import { ContactName } from '@src/modules/contact/domain/value-objects/contact-name';
import { ContactInMemoryRepository } from '@src/modules/contact/infrastructure/persistence/contact.in-memory.repository';
import { CONTACT_REPOSITORY } from '@src/modules/contact/infrastructure/persistence/contact.repository';
import { randomUUID } from 'crypto';
import { Some } from 'oxide.ts';
import { CreateContactCommand } from '../create-contact.command';
import { CreateContactService } from '../create-contact.service';

describe('Create Contact Service', () => {
  let service: CreateContactService;
  let repository: ContactInMemoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateContactService,

        {
          provide: CONTACT_REPOSITORY,
          useClass: ContactInMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<CreateContactService>(CreateContactService);
    repository = module.get<ContactInMemoryRepository>(CONTACT_REPOSITORY);
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
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(ContactEmail.create(existingEmail).unwrap()),
        phone: Some('111'),
      });
      const existingContact = existingContactResult.unwrap();
      await repository.save(existingContact);

      const command = new CreateContactCommand({
        bookerId: existingContact.bookerId,
        name: Some(
          ContactName.create({
            firstName: Some('Jane'),
            lastName: Some('Dine'),
          }).unwrap(),
        ),
        email: existingContact.email,
        phone: Some('00'),
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
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(ContactEmail.create('john.doe@mail.com').unwrap()),
        phone: Some('1234567890'),
      });
      const contactsCount = repository.contacts.length;

      // Act
      const result = await service.execute(command);

      // Assert
      expect(result.isOk()).toBe(true);
      expect(repository.contacts.length).toBe(contactsCount + 1);
      const contactId = result.unwrap();
      expect(contactId).toBeDefined();
      expect(contactId).not.toBeNull();

      // Test event !!
    });
  });
});
