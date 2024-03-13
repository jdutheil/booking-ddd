import { Test, TestingModule } from '@nestjs/testing';
import { Contact } from '@src/domains/contacts/contact/domain/contact.entity';
import { ContactEmail } from '@src/domains/contacts/contact/domain/value-objects/contact-email';
import { ContactName } from '@src/domains/contacts/contact/domain/value-objects/contact-name';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { EntityID } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { Option, Some } from 'oxide.ts';
import { ContactPrismaRepository } from '../../contact.prisma.repository';
import { ContactMapper } from './../../../../domain/contact.mapper';

describe('ContactPrismaRepository Integration Test', () => {
  let contactPrismaRepository: ContactPrismaRepository;
  let prismaService: PrismaService;
  let existingBookerId: EntityID;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ContactMapper, ContactPrismaRepository],
    }).compile();

    contactPrismaRepository = module.get<ContactPrismaRepository>(
      ContactPrismaRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);

    const booker = await prismaService.booker.create({
      data: { email: 'test@test.com' },
    });
    existingBookerId = booker.id;
  });

  afterAll(async () => {
    const deleteBooker = prismaService.booker.deleteMany();
    const deleteContact = prismaService.contact.deleteMany();
    await prismaService.$transaction([deleteBooker, deleteContact]);
    await prismaService.$disconnect();
  });

  describe('save', () => {
    afterEach(async () => {
      await prismaService.contact.deleteMany();
    });

    it('should insert a new contact', async () => {
      // Arrange
      const contactResult = Contact.create({
        bookerId: existingBookerId,
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(ContactEmail.create('john.doe@mail.com').unwrap()),
        phone: Some('123456789'),
      });
      const contact = contactResult.unwrap();

      const contactsCount = await prismaService.contact.count();

      // Act
      await contactPrismaRepository.save(contact);

      // Assert
      const newContactsCount = await prismaService.contact.count();
      expect(newContactsCount).toBe(contactsCount + 1);
      const newContact = await prismaService.contact.findUnique({
        where: { id: contact.id },
      });

      expect(newContact).toBeDefined();
      expect(newContact?.id).toBe(contact.id);
    });

    it('should update an existing contact', async () => {
      // Arrange
      const contactResult = Contact.create({
        bookerId: existingBookerId,
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(ContactEmail.create('john.doe@mail.com').unwrap()),
        phone: Some('123456789'),
      });
      const contact = contactResult.unwrap();
      await contactPrismaRepository.save(contact);

      const contactsCount = await prismaService.contact.count();

      // Act
      const newContactName = Some(
        ContactName.create({
          firstName: Some('Jane'),
          lastName: Some('Dine'),
        }).unwrap(),
      );
      contact.changeName(newContactName);

      await contactPrismaRepository.save(contact);

      // Assert
      const newContactsCount = await prismaService.contact.count();
      expect(newContactsCount).toBe(contactsCount);

      const contactFromDb = await prismaService.contact.findUnique({
        where: { id: contact.id },
      });
      expect(contactFromDb?.firstName).toBe(
        newContactName.unwrap().firstName.unwrap(),
      );
      expect(contactFromDb?.lastName).toBe(
        newContactName.unwrap().lastName.unwrap(),
      );
    });
  });

  describe('idExists', () => {
    afterEach(async () => {
      await prismaService.contact.deleteMany();
    });

    it('should return true if contact exists', async () => {
      // Arrange
      const contactResult = Contact.create({
        bookerId: existingBookerId,
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(ContactEmail.create('john.doe@mail.com').unwrap()),
        phone: Some('123456789'),
      });
      const contact = contactResult.unwrap();
      await contactPrismaRepository.save(contact);

      // Act
      const result = await contactPrismaRepository.idExists(contact.id);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if contact does not exists', async () => {
      // Arrange
      const contactId = randomUUID();

      // Act
      const result = await contactPrismaRepository.idExists(contactId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('findOneById', () => {
    afterEach(async () => {
      await prismaService.contact.deleteMany();
    });

    it('should return a contact if exists', async () => {
      // Arrange
      const contactResult = Contact.create({
        bookerId: existingBookerId,
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(ContactEmail.create('john.doe@mail.com').unwrap()),
        phone: Some('123456789'),
      });
      const contact = contactResult.unwrap();
      await contactPrismaRepository.save(contact);

      // Act
      const result = await contactPrismaRepository.findOneById(contact.id);

      // Assert
      expect(result.isSome()).toBe(true);
      expect(result.unwrap().id).toBe(contact.id);
    });

    it('should return none if contact does not exist', async () => {
      // Arrange
      const contactId = randomUUID();

      // Act
      const result = await contactPrismaRepository.findOneById(contactId);

      // Assert
      expect(result.isNone()).toBe(true);
    });
  });

  describe('emailExistsForBooker', () => {
    afterEach(async () => {
      await prismaService.contact.deleteMany();
    });

    it('should return true if email exists for booker', async () => {
      // Arrange
      const email = 'john.doe@mail.com';
      const bookerId = existingBookerId;
      const contactResult = Contact.create({
        bookerId: existingBookerId,
        name: Option.from(
          ContactName.create({
            firstName: Option.from('John'),
            lastName: Option.from('Doe'),
          }).unwrap(),
        ),
        email: Option.from(ContactEmail.create(email).unwrap()),
        phone: Option.from('123456789'),
      });
      const contact = contactResult.unwrap();
      await contactPrismaRepository.save(contact);

      // Act
      const result = await contactPrismaRepository.emailExistsForBooker(
        email,
        bookerId,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if email does not exist for booker', async () => {
      // Act
      const result = await contactPrismaRepository.emailExistsForBooker(
        'john.doe@mail.com',
        existingBookerId,
      );

      // Assert
      expect(result).toBe(false);
    });

    it('should return false if email exists for another booker', async () => {
      // Arrange
      const otherBooker = await prismaService.booker.create({
        data: { id: randomUUID(), email: 'booker@mail.com' },
      });
      const email = 'test-email@mail.com';
      const contactResult = Contact.create({
        bookerId: otherBooker.id,
        name: Option.from(
          ContactName.create({
            firstName: Option.from('John'),
            lastName: Option.from('Doe'),
          }).unwrap(),
        ),
        email: Option.from(ContactEmail.create(email).unwrap()),
        phone: Option.from('123456789'),
      });
      const contact = contactResult.unwrap();
      await contactPrismaRepository.save(contact);

      // Act
      const result = await contactPrismaRepository.emailExistsForBooker(
        email,
        existingBookerId,
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('findOneByEmailForBooker', () => {
    afterEach(async () => {
      await prismaService.contact.deleteMany();
    });

    it('should return a contact if email exists for booker', async () => {
      // Arrange
      const contactResult = Contact.create({
        bookerId: existingBookerId,
        name: Some(
          ContactName.create({
            firstName: Some('John'),
            lastName: Some('Doe'),
          }).unwrap(),
        ),
        email: Some(ContactEmail.create('john.doe@mail.com').unwrap()),
        phone: Some('123456789'),
      });
      const contact = contactResult.unwrap();
      await contactPrismaRepository.save(contact);

      // Act
      const result = await contactPrismaRepository.findOneByEmailForBooker(
        'john.doe@mail.com',
        existingBookerId,
      );

      // Assert
      expect(result.isSome()).toBe(true);
      expect(result.unwrap().id).toBe(contact.id);
    });

    it('should return none if email does not exist for booker', async () => {
      // Act
      const result = await contactPrismaRepository.findOneByEmailForBooker(
        'jane.doe@mail.com',
        existingBookerId,
      );

      // Assert
      expect(result.isNone()).toBe(true);
    });

    it('should return None if email exists for another booker', async () => {
      // Arrange
      const otherBooker = await prismaService.booker.create({
        data: { id: randomUUID(), email: 'other.booker@mail.com' },
      });
      const email = 'test-email@mail.com';
      const contactResult = Contact.create({
        bookerId: otherBooker.id,
        name: Option.from(
          ContactName.create({
            firstName: Option.from('John'),
            lastName: Option.from('Doe'),
          }).unwrap(),
        ),
        email: Option.from(ContactEmail.create(email).unwrap()),
        phone: Option.from('123456789'),
      });
      const contact = contactResult.unwrap();
      await contactPrismaRepository.save(contact);

      // Act
      const result = await contactPrismaRepository.findOneByEmailForBooker(
        email,
        existingBookerId,
      );

      // Assert
      expect(result.isNone()).toBe(true);
    });
  });
});
