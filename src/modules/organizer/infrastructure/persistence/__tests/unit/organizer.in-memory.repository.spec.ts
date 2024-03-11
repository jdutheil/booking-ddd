import { Test, TestingModule } from '@nestjs/testing';
import { EntityID } from '@src/libs/ddd';
import { Organizer } from '@src/modules/organizer/domain/organizer.entity';
import { randomUUID } from 'crypto';
import { OrganizerInMemoryRepository } from '../../organizer.in-memory.repository';

describe('OrganizerInMemoryRepository', () => {
  let repository: OrganizerInMemoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizerInMemoryRepository],
    }).compile();

    repository = module.get<OrganizerInMemoryRepository>(
      OrganizerInMemoryRepository,
    );
  });

  describe('Insert or update a Organizer', () => {
    afterEach(() => {
      repository.organizers = [];
    });

    it('should insert a new Organizer', async () => {
      // Arrange
      const organizer = Organizer.create({
        bookerId: randomUUID(),
        name: 'John Doe',
        contactIds: [],
      }).unwrap();

      const organizersCount = repository.organizers.length;

      // Act
      await repository.save(organizer);

      // Assert
      expect(repository.organizers.length).toBe(organizersCount + 1);
    });

    it('should update an existing organizer', async () => {
      // Arrange
      const organizer = Organizer.create({
        bookerId: randomUUID(),
        name: 'John Doe',
        contactIds: [],
      }).unwrap();
      await repository.save(organizer);
      const organizersCount = repository.organizers.length;

      // Act
      organizer.changeName('Jérémy Dutheil');
      await repository.save(organizer);

      // Assert
      expect(repository.organizers.length).toBe(organizersCount);
    });
  });

  describe('Find a Organizer by ID', () => {
    let knownOrganizerId: EntityID;

    beforeAll(async () => {
      const organizer = Organizer.create({
        bookerId: randomUUID(),
        name: 'John Doe',
        contactIds: [],
      }).unwrap();
      await repository.save(organizer);

      knownOrganizerId = organizer.id;
    });

    afterAll(() => {
      repository.organizers = [];
    });

    it('given an existing ID, should return the organizer', async () => {
      // Act
      const result = await repository.findOneById(knownOrganizerId);

      // Assert
      expect(result.isSome()).toBe(true);
      const organizer = result.unwrap();
      expect(organizer).toBeInstanceOf(Organizer);
      expect(organizer.id).toEqual(knownOrganizerId);
    });

    it('given an unknown ID, should return None', async () => {
      // Act
      const result = await repository.findOneById(randomUUID());

      // Assert
      expect(result.isNone()).toBe(true);
    });
  });

  describe('Find all organizers for a booker', () => {
    let knownBookerId: EntityID;

    beforeAll(async () => {
      const organizer = Organizer.create({
        bookerId: randomUUID(),
        name: 'John Doe',
        contactIds: [],
      }).unwrap();
      await repository.save(organizer);

      knownBookerId = organizer.bookerId;
    });

    afterAll(() => {
      repository.organizers = [];
    });

    it('given an existing booker ID, should return the organizers', async () => {
      // Act
      const result = await repository.findAllForBooker(knownBookerId);

      // Assert
      expect(result.length).toBeGreaterThan(0);
      result.forEach((organizer) => {
        expect(organizer.bookerId).toEqual(knownBookerId);
      });
    });

    it('given an unknown booker ID, should return an empty array', async () => {
      // Act
      const result = await repository.findAllForBooker(randomUUID());

      // Assert
      expect(result.length).toBe(0);
    });
  });
});
