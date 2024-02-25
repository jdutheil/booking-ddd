import { Test, TestingModule } from '@nestjs/testing';
import { BookerAlreadyExistsError } from '@src/modules/booker/domain/booker.errors';
import { BookerInMemoryRepository } from '@src/modules/booker/infrastructure/persistence/booker.in-memory-repository';
import { BOOKER_REPOSITORY } from '@src/modules/booker/infrastructure/persistence/booker.repository.port';
import { RegisterBookerCommand } from '../../register-booker.command';
import { RegisterBookerService } from '../../register-booker.service';

describe('Register Booker Service', () => {
  let service: RegisterBookerService;
  let repository: BookerInMemoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BOOKER_REPOSITORY,
          useClass: BookerInMemoryRepository,
        },

        RegisterBookerService,
      ],
    }).compile();

    service = module.get<RegisterBookerService>(RegisterBookerService);
    repository = module.get<BookerInMemoryRepository>(BOOKER_REPOSITORY);
  });

  beforeEach(() => {
    repository.bookers = [];
  });

  it('should register a new booker', async () => {
    const bookerCounts = repository.bookers.length;
    const command = new RegisterBookerCommand({ email: 'test@mail.com' });

    const result = await service.execute(command);
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).not.toBeNull();
    expect(repository.bookers.length).toBe(bookerCounts + 1);
  });

  it('should return an error if the email is already in used', async () => {
    const command = new RegisterBookerCommand({ email: 'test@gmail.com' });
    await service.execute(command);

    const result = await service.execute(command);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(BookerAlreadyExistsError);
  });
});
