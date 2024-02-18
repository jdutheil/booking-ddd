import { Test, TestingModule } from '@nestjs/testing';
import { AggregateID } from '@src/libs/ddd';
import { UserInMemoryRepository } from '@src/modules/user/database/user.in-memory-repository';
import { USER_REPOSITORY } from '@src/modules/user/database/user.repository.port';
import { UserAlreadyExistsError } from '@src/modules/user/domain/user.errors';
import { Result } from 'oxide.ts';
import { CreateUserCommand } from '../../create-user.command';
import { CreateUserService } from '../../create-user.service';

describe('CreateUserService Unit Tests', () => {
  let service: CreateUserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: USER_REPOSITORY,
          useClass: UserInMemoryRepository,
        },

        CreateUserService,
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const userDatas = new CreateUserCommand({
      email: 'test@mail.com',
      password: 'password',
    });

    const user = (await service.execute(userDatas)).unwrap();

    expect(user).toBeDefined();
    // TODO : Test get user by id
  });

  it('should throw an error if the email is already used', async () => {
    const userDatas = new CreateUserCommand({
      email: 'test@gmail.com',
      password: 'password',
    });

    await service.execute(userDatas);

    const result: Result<AggregateID, UserAlreadyExistsError> =
      await service.execute(userDatas);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(UserAlreadyExistsError);
  });
});
