import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { EntityID } from '@src/libs/ddd';
import { Organizer } from '@src/modules/organizer/domain/organizer.entity';
import { OrganizerMapper } from '@src/modules/organizer/domain/organizer.mapper';
import { randomUUID } from 'crypto';
import { OrganizerPrismaRepository } from '../../organizer.prisma.repository';

describe('OrganizerPrismaRepository Integration Test', () => {
  let organizerPrismaRepository: OrganizerPrismaRepository;
  let prismaService: PrismaService;
  let existingBookerId: EntityID;
  let existingContactIds: EntityID[] = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [OrganizerMapper, OrganizerPrismaRepository],
    }).compile();

    organizerPrismaRepository = module.get<OrganizerPrismaRepository>(
      OrganizerPrismaRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);

    // Create dummy datas
    const booker = await prismaService.booker.create({
      data: { email: 'john.doe@mail.com' },
    });
    existingBookerId = booker.id;

    const contactDatas = [
      {
        firstName: 'Jérémy',
        lastName: 'Dutheil',
        email: 'jeremy@booking-app.com',
        bookerId: existingBookerId,
      },

      {
        firstName: 'Aurélie',
        lastName: 'Cabarrot',
        email: 'aurelie@booking-app.com',
        bookerId: existingBookerId,
      },
    ];
    await prismaService.contact.createMany({
      data: contactDatas,
    });
    const contacts = await prismaService.contact.findMany();
    existingContactIds = contacts.map((contact) => contact.id);
  });

  afterAll(async () => {
    const deleteBooker = prismaService.booker.deleteMany();
    const deleteContact = prismaService.contact.deleteMany();
    const deleteOrganizer = prismaService.organizer.deleteMany();

    await prismaService.$transaction([
      deleteBooker,
      deleteContact,
      deleteOrganizer,
    ]);
    await prismaService.$disconnect();
  });

  describe('Save', () => {
    afterEach(async () => {
      await prismaService.organizer.deleteMany();
    });

    it('should insert a new organizer', async () => {
      // Arrange
      const organizerResult = Organizer.create({
        bookerId: existingBookerId,
        name: 'Organizer Test',
        contactIds: [],
      });
      const organizer = organizerResult.unwrap();

      const organizersCount = await prismaService.organizer.count();

      // Act
      await organizerPrismaRepository.save(organizer);

      // Assert
      const newOrganizersCount = await prismaService.organizer.count();
      expect(newOrganizersCount).toBe(organizersCount + 1);
      const newOrganizer = await prismaService.organizer.findUnique({
        where: { id: organizer.id },
      });
      expect(newOrganizer).toBeDefined();
      expect(newOrganizer?.id).toBe(organizer.id);
      expect(newOrganizer?.name).toBe('Organizer Test');
    });

    it('should insert a new organizer and link contacts', async () => {
      // Arrange
      const organizerResult = Organizer.create({
        bookerId: existingBookerId,
        name: 'Organizer Test',
        contactIds: existingContactIds,
      });
      const organizer = organizerResult.unwrap();

      const organizersCount = await prismaService.organizer.count();

      // Act
      await organizerPrismaRepository.save(organizer);

      // Assert
      const newOrganizersCount = await prismaService.organizer.count();
      expect(newOrganizersCount).toBe(organizersCount + 1);
      const newOrganizer = await prismaService.organizer.findUnique({
        where: { id: organizer.id },
        include: { contacts: true },
      });
      expect(newOrganizer).toBeDefined();
      expect(newOrganizer?.id).toBe(organizer.id);
      expect(newOrganizer?.name).toBe('Organizer Test');
      expect(newOrganizer?.contacts).toHaveLength(2);
    });

    it('should update an existing organizer', async () => {
      // Arrange
      const organizer = Organizer.create({
        bookerId: existingBookerId,
        name: 'Organizer Test',
        contactIds: [],
      }).unwrap();
      await organizerPrismaRepository.save(organizer);

      const organizersCount = await prismaService.organizer.count();

      // Act
      organizer.changeName('Updated Organizer Test');
      await organizerPrismaRepository.save(organizer);

      // Assert
      const newOrganizersCount = await prismaService.organizer.count();
      expect(newOrganizersCount).toBe(organizersCount);
      const updatedOrganizer = await prismaService.organizer.findUnique({
        where: { id: organizer.id },
      });
      expect(updatedOrganizer).toBeDefined();
      expect(updatedOrganizer?.id).toBe(organizer.id);
      expect(updatedOrganizer?.name).toBe('Updated Organizer Test');
    });
  });

  describe('idExists', () => {
    afterEach(async () => {
      await prismaService.organizer.deleteMany();
    });

    it('should return true if organizer exists', async () => {
      // Arrange
      const organizer = Organizer.create({
        bookerId: existingBookerId,
        name: 'Organizer Test',
        contactIds: [],
      }).unwrap();
      await organizerPrismaRepository.save(organizer);

      // Act
      const exists = await organizerPrismaRepository.idExists(organizer.id);

      // Assert
      expect(exists).toBe(true);
    });

    it('should return false if organizer does not exist', async () => {
      // Act
      const exists = await organizerPrismaRepository.idExists(randomUUID());

      // Assert
      expect(exists).toBe(false);
    });
  });

  describe('findOneById', () => {
    afterEach(async () => {
      await prismaService.organizer.deleteMany();
    });

    it('should return an organizer if it exists', async () => {
      // Arrange
      const organizer = Organizer.create({
        bookerId: existingBookerId,
        name: 'Organizer Test',
        contactIds: [],
      }).unwrap();
      await organizerPrismaRepository.save(organizer);

      // Act
      const foundOrganizer = await organizerPrismaRepository.findOneById(
        organizer.id,
      );

      // Assert
      expect(foundOrganizer.isSome()).toBe(true);
      expect(foundOrganizer.unwrap().id).toBe(organizer.id);
    });

    it('should return none if organizer does not exist', async () => {
      // Act
      const foundOrganizer =
        await organizerPrismaRepository.findOneById(randomUUID());

      // Assert
      expect(foundOrganizer.isNone()).toBe(true);
    });
  });

  describe('findAllForBooker', () => {
    afterEach(async () => {
      await prismaService.organizer.deleteMany();
    });

    it('should return all organizers for a booker', async () => {
      // Arrange
      const organizer1 = Organizer.create({
        bookerId: existingBookerId,
        name: 'Organizer Test 1',
        contactIds: [],
      }).unwrap();
      await organizerPrismaRepository.save(organizer1);

      const organizer2 = Organizer.create({
        bookerId: existingBookerId,
        name: 'Organizer Test 2',
        contactIds: [],
      }).unwrap();
      await organizerPrismaRepository.save(organizer2);

      const otherBooker = await prismaService.booker.create({
        data: { email: 'other.booker@mail.com' },
      });
      const otherOrganizer = Organizer.create({
        bookerId: otherBooker.id,
        name: 'Other Organizer Test',
        contactIds: [],
      }).unwrap();
      await organizerPrismaRepository.save(otherOrganizer);

      // Act
      const organizers =
        await organizerPrismaRepository.findAllForBooker(existingBookerId);

      // Assert
      expect(organizers).toHaveLength(2);
      expect(organizers[0].id).toBe(organizer1.id);
      expect(organizers[1].id).toBe(organizer2.id);
    });

    it('should return an empty array if no organizer exists for a booker', async () => {
      // Act
      const organizers =
        await organizerPrismaRepository.findAllForBooker(randomUUID());

      // Assert
      expect(organizers).toHaveLength(0);
    });
  });
});
