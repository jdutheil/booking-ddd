import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AggregateID } from '@src/libs/ddd';
import { BookerInMemoryRepository } from '@src/modules/booker/database/booker.in-memory-repository';
import { USER_REPOSITORY } from '@src/modules/booker/database/booker.repository.port';
import { BookerAlreadyExistsError } from '@src/modules/booker/domain/booker.errors';
import { BookerCreatedEvent } from '@src/modules/booker/domain/events/booker-created.event';
import { Result } from 'oxide.ts';
import { CreateBookerCommand } from '../../create-booker.command';
import { CreateBookerService } from '../../create-booker.service';

describe('CreateBookerService Unit Tests', () => {
  let service: CreateBookerService;
  let repository: BookerInMemoryRepository;
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: USER_REPOSITORY,
          useClass: BookerInMemoryRepository,
        },

        CreateBookerService,

        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateBookerService>(CreateBookerService);
    repository = module.get<BookerInMemoryRepository>(USER_REPOSITORY);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
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
      password: 'password',
    });

    const bookerId = (await service.execute(bookerDatas)).unwrap();

    expect(bookerId).toBeDefined();
    expect(repository.bookers.length).toBe(bookersCount + 1);

    expect(eventEmitter.emit).toHaveBeenCalledWith(
      BookerCreatedEvent.eventName,
      {
        id: bookerId,
        email: bookerDatas.email,
        password: bookerDatas.password,
      },
    );
  });

  it('should return an error if the email is already used', async () => {
    const bookerDatas = new CreateBookerCommand({
      email: 'test@gmail.com',
      password: 'password',
    });

    await service.execute(bookerDatas);

    const result: Result<AggregateID, BookerAlreadyExistsError> =
      await service.execute(bookerDatas);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(BookerAlreadyExistsError);
  });
});
