import { Test, TestingModule } from '@nestjs/testing';
import { Contact } from '@src/domains/contacts/contact/domain/contact.entity';
import { ContactName } from '@src/domains/contacts/contact/domain/value-objects/contact-name';
import { Email } from '@src/domains/contacts/shared/domain/value-objects/email';
import { EntityID } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { Some } from 'oxide.ts';
import { ContactInMemoryRepository } from '../../contact.in-memory.repository';

describe('ContactInMemoryRepository', () => {
  let repository: ContactInMemoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactInMemoryRepository],
    }).compile();

    repository = module.get<ContactInMemoryRepository>(
      ContactInMemoryRepository,
    );
  });

  describe('Insert or update a Contact', () => {
    afterEach(() => {
      repository.contacts = [];
    });

    it('should insert a new contact', async () => {
      // Arrange
      const contact = Contact.create({
        bookerId: randomUUID(),
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(Email.create('john.doe@mail.com').unwrap()),
        phone: Some('123456789'),
      }).unwrap();

      const contactsCount = repository.contacts.length;

      // Act
      await repository.save(contact);

      // Assert
      expect(repository.contacts.length).toBe(contactsCount + 1);
    });

    it('should update an existing contact', async () => {
      // Arrange
      const contact = Contact.create({
        bookerId: randomUUID(),
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(Email.create('john.doe@mail.com').unwrap()),
        phone: Some('123456789'),
      }).unwrap();
      await repository.save(contact);

      contact.updateEmail(Some(Email.create('another@mail.com').unwrap()));
      const contactsCount = repository.contacts.length;

      // Act
      await repository.save(contact);

      // Assert
      expect(repository.contacts.length).toBe(contactsCount);
    });
  });

  describe('Find a contact', () => {
    let knownContactId: EntityID;
    let knownContactEmail: string;
    let knownContactBookerId: EntityID;

    beforeAll(async () => {
      const contact = Contact.create({
        bookerId: randomUUID(),
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(Email.create('john.doe@mail.com').unwrap()),
        phone: Some('123456789'),
      }).unwrap();
      await repository.save(contact);

      knownContactId = contact.id;
      knownContactEmail = contact.email.unwrap().value;
      knownContactBookerId = contact.bookerId;
    });

    afterAll(() => {
      repository.contacts = [];
    });

    it('given an existing ID, should return the contact', async () => {
      // Act
      const result = await repository.findOneById(knownContactId);

      // Assert
      expect(result.isSome()).toBe(true);
      expect(result.unwrap().id).toEqual(knownContactId);
    });

    it('given an unknown ID, should return an error', async () => {
      // Act
      const result = await repository.findOneById(randomUUID());

      // Assert
      expect(result.isNone()).toBe(true);
    });

    it('given an existing email, should return the contact', async () => {
      // Act
      const result = await repository.findOneByEmailForBooker(
        knownContactEmail,
        knownContactBookerId,
      );

      // Assert
      expect(result.isSome()).toBe(true);
      expect(result.unwrap().props.email.unwrap().value).toEqual(
        knownContactEmail,
      );
    });

    it('given an unknown email, should return an error', async () => {
      // Act
      const result = await repository.findOneByEmailForBooker(
        'unknown@mail.com',
        knownContactBookerId,
      );

      // Assert
      expect(result.isNone()).toBe(true);
    });

    it('given an existing email for a different booker, should return an error', async () => {
      // Act
      const result = await repository.findOneByEmailForBooker(
        knownContactEmail,
        randomUUID(),
      );

      // Assert
      expect(result.isNone()).toBe(true);
    });
  });

  describe('Does a contact exist', () => {
    let knownContactId: EntityID;
    let knownContactEmail: string;
    let knownContactBookerId: EntityID;

    beforeAll(async () => {
      const contact = Contact.create({
        bookerId: randomUUID(),
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(Email.create('john.doe@mail.com').unwrap()),
        phone: Some('123456789'),
      }).unwrap();
      await repository.save(contact);

      knownContactId = contact.id;
      knownContactEmail = contact.props.email.unwrap().value;
      knownContactBookerId = contact.props.bookerId;
    });

    afterAll(() => {
      repository.contacts = [];
    });

    it('given an existing ID, should return true', async () => {
      // Act
      const result = await repository.idExists(knownContactId);

      // Assert
      expect(result).toBe(true);
    });

    it('given an unknown ID, should return false', async () => {
      // Act
      const result = await repository.idExists(randomUUID());

      // Assert
      expect(result).toBe(false);
    });

    it('given an existing email, should return true', async () => {
      // Act
      const result = await repository.emailExistsForBooker(
        knownContactEmail,
        knownContactBookerId,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('given an unknown email, should return false', async () => {
      // Act
      const result = await repository.emailExistsForBooker(
        'unknown@mail.com',
        knownContactBookerId,
      );

      // Assert
      expect(result).toBe(false);
    });

    it('given an existing email for a different booker, should return false', async () => {
      // Act
      const result = await repository.emailExistsForBooker(
        knownContactEmail,
        randomUUID(),
      );

      // Assert
      expect(result).toBe(false);
    });
  });
});
