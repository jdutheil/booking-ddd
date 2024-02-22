import { Test, TestingModule } from '@nestjs/testing';
import { AggregateID } from '@src/libs/ddd';
import { BookerInMemoryRepository } from '@src/modules/booker/database/booker.in-memory-repository';
import { USER_REPOSITORY } from '@src/modules/booker/database/booker.repository.port';
import { BookerAlreadyExistsError } from '@src/modules/booker/domain/booker.errors';
import { Result } from 'oxide.ts';
import { CreateBookerCommand } from '../../create-booker.command';
import { CreateBookerService } from '../../create-booker.service';

describe('CreateBookerService Unit Tests', () => {
  let service: CreateBookerService;
  let repository: BookerInMemoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: USER_REPOSITORY,
          useClass: BookerInMemoryRepository,
        },

        CreateBookerService,
      ],
    }).compile();

    service = module.get<CreateBookerService>(CreateBookerService);
    repository = module.get<BookerInMemoryRepository>(USER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(() => {
    repository.bookers = [];
  });

  it('should create a new booker', async () => {
    const bookersCount = repository.bookers.length;

    const bookerDatas = new CreateBookerCommand({
      email: 'test@mail.com',
    });

    const booker = (await service.execute(bookerDatas)).unwrap();

    expect(booker).toBeDefined();
    expect(repository.bookers.length).toBe(bookersCount + 1);
    // TODO : Test get booker by id
  });

  it('should return an error if the email is already used', async () => {
    const bookerDatas = new CreateBookerCommand({
      email: 'test@gmail.com',
    });

    await service.execute(bookerDatas);

    const result: Result<AggregateID, BookerAlreadyExistsError> =
      await service.execute(bookerDatas);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(BookerAlreadyExistsError);
  });
});
