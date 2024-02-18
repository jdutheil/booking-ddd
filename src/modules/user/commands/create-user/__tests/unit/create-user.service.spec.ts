import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserCommand } from '../../create-user.command';
import { CreateUserService } from '../../create-user.service';

describe('CreateUserService Unit Tests', () => {
  let service: CreateUserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUserService],
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

    const user = await service.execute(userDatas);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe(userDatas.email);
  });
});
