import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationAlreadyExistsError } from '@src/infrastructure/rest-api/authentication/domain/authentication.errors';
import { Argon2PasswordManager } from '@src/infrastructure/rest-api/authentication/infrastructure/argon2-password-manager';
import { AuthenticationInMemoryRepository } from '@src/infrastructure/rest-api/authentication/infrastructure/database/authentication.in-memory.repository';
import { AggregateID } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { Result } from 'oxide.ts';
import { AUTHENTICATION_REPOSITORY } from '../../../../ports/authentication.repository.port';
import { PASSWORD_MANAGER } from '../../../../ports/password-manager.port';
import { CreateAuthenticationCommand } from '../../create-authentication.command';
import { CreateAuthenticationService } from '../../create-authentication.service';

describe('CreateAuthenticationService Unit Tests', () => {
  let service: CreateAuthenticationService;
  let repository: AuthenticationInMemoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AUTHENTICATION_REPOSITORY,
          useClass: AuthenticationInMemoryRepository,
        },

        {
          provide: PASSWORD_MANAGER,
          useClass: Argon2PasswordManager,
        },

        CreateAuthenticationService,
      ],
    }).compile();

    service = module.get<CreateAuthenticationService>(
      CreateAuthenticationService,
    );
    repository = module.get<AuthenticationInMemoryRepository>(
      AUTHENTICATION_REPOSITORY,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(() => {
    repository.authentications = [];
  });

  it('should create a new Authentication', async () => {
    const authCount = repository.authentications.length;
    const authDatas = new CreateAuthenticationCommand({
      email: 'test@mail.com',
      password: '$strongPassw0rd;',
      bookerId: randomUUID(),
    });

    const result: Result<AggregateID, AuthenticationAlreadyExistsError> =
      await service.execute(authDatas);
    expect(result.isOk()).toBe(true);
    const id = result.unwrap();
    expect(id).not.toBeNull();
    expect(repository.authentications.length).toBe(authCount + 1);
  });

  it('should hash the password when creating Authentication', async () => {
    const password = '$strongPassw0rd';
    const authDatas = new CreateAuthenticationCommand({
      email: 'test@mail.com',
      password,
      bookerId: randomUUID(),
    });

    const result: Result<AggregateID, AuthenticationAlreadyExistsError> =
      await service.execute(authDatas);
    const id = result.unwrap();

    const authentication = repository.authentications.find(
      (auth) => auth.id === id,
    );
    expect(authentication!.password).not.toBe(password);
  });
});
