import { Test, TestingModule } from '@nestjs/testing';
import { Organizer } from '@src/domains/contacts/organizer/domain/organizer.entity';
import { OrganizerInMemoryRepository } from '@src/domains/contacts/organizer/infrastructure/persistence/organizer.in-memory.repository';
import { ORGANIZER_REPOSITORY } from '@src/domains/contacts/organizer/infrastructure/persistence/organizer.repository';
import { randomUUID } from 'crypto';
import { FindOrganizersForBookerQueryHandler } from '../../find-organizers-for-booker.handler';

describe('Find Organizers for Booker', () => {
  let queryHandler: FindOrganizersForBookerQueryHandler;
  let organizersRepository: OrganizerInMemoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOrganizersForBookerQueryHandler,

        {
          provide: ORGANIZER_REPOSITORY,
          useClass: OrganizerInMemoryRepository,
        },
      ],
    }).compile();

    queryHandler = module.get<FindOrganizersForBookerQueryHandler>(
      FindOrganizersForBookerQueryHandler,
    );
    organizersRepository =
      module.get<OrganizerInMemoryRepository>(ORGANIZER_REPOSITORY);
  });

  afterEach(() => {
    organizersRepository.organizers = [];
  });

  it('should return an empty array if no organizers are found', async () => {
    const result = await queryHandler.execute({ bookerId: randomUUID() });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual([]);
  });

  it('should return an array of organizers if they are found', async () => {
    // Arrange
    const bookerId = randomUUID();
    const organizers: Organizer[] = [
      Organizer.create({
        bookerId,
        name: 'Organizer 1',
        contactIds: [],
      }).unwrap(),
      Organizer.create({
        bookerId,
        name: 'Organizer 2',
        contactIds: [],
      }).unwrap(),
    ];
    organizersRepository.organizers = organizers;

    // Act
    const result = await queryHandler.execute({ bookerId });

    // Assert
    expect(result.isOk()).toBe(true);
    expect(result.unwrap().length).toEqual(organizers.length);
  });

  it('should not return organizers from another booker', async () => {
    // Arrange
    const bookerId = randomUUID();
    const organizers: Organizer[] = [
      Organizer.create({
        bookerId,
        name: 'Organizer 1',
        contactIds: [],
      }).unwrap(),
      Organizer.create({
        bookerId,
        name: 'Organizer 2',
        contactIds: [],
      }).unwrap(),
      Organizer.create({
        bookerId: randomUUID(),
        name: 'Other organizer',
        contactIds: [],
      }).unwrap(),
    ];
    organizersRepository.organizers = organizers;

    // Act
    const result = await queryHandler.execute({ bookerId });

    // Assert
    expect(result.isOk()).toBe(true);
    expect(result.unwrap().length).toEqual(organizers.length - 1);
  });
});
