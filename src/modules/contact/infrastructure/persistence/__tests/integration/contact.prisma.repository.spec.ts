import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { EntityID } from '@src/libs/ddd';
import { Contact } from '@src/modules/contact/domain/contact.entity';
import { ContactEmail } from '@src/modules/contact/domain/value-objects/contact-email';
import { ContactName } from '@src/modules/contact/domain/value-objects/contact-name';
import { Some } from 'oxide.ts';
import { ContactPrismaRepository } from '../../contact.prisma.repository';
import { ContactMapper } from './../../../../domain/contact.mapper';

describe('ContactPrismaRepository Integration Test', () => {
  let contactPrismaRepository: ContactPrismaRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ContactMapper, ContactPrismaRepository],
    }).compile();

    contactPrismaRepository = module.get<ContactPrismaRepository>(
      ContactPrismaRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    const deleteBooker = prismaService.booker.deleteMany();
    const deleteContact = prismaService.contact.deleteMany();
    await prismaService.$transaction([deleteBooker, deleteContact]);
    await prismaService.$disconnect();
  });

  describe('save', () => {
    let existingBookerId: EntityID;

    beforeAll(async () => {
      const booker = await prismaService.booker.create({
        data: { email: 'test@test.com' },
      });
      existingBookerId = booker.id;
    });

    afterAll(async () => {
      await prismaService.booker.deleteMany();
    });

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
  });
});
