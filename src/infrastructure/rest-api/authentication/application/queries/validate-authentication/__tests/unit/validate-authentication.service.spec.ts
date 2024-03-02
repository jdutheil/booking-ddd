import { Test, TestingModule } from '@nestjs/testing';
import { AUTHENTICATION_REPOSITORY } from '@src/infrastructure/rest-api/authentication/application/ports/authentication.repository.port';
import { PASSWORD_MANAGER } from '@src/infrastructure/rest-api/authentication/application/ports/password-manager.port';
import { Authentication } from '@src/infrastructure/rest-api/authentication/domain/authentication.entity';
import {
  AuthenticationError,
  AuthenticationInvalidEmailError,
  AuthenticationInvalidPasswordError,
} from '@src/infrastructure/rest-api/authentication/domain/authentication.errors';
import { Argon2PasswordManager } from '@src/infrastructure/rest-api/authentication/infrastructure/argon2-password-manager';
import { AuthenticationInMemoryRepository } from '@src/infrastructure/rest-api/authentication/infrastructure/database/authentication.in-memory.repository';
import { EntityID } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { Result } from 'oxide.ts';
import { ValidateAuthenticationQuery } from '../../validate-authentication.query';
import { ValidateAuthenticationService } from '../../validate-authentication.service';

describe('ValidateAuthenticationService Unit Tests', () => {
  let service: ValidateAuthenticationService;
  let repository: AuthenticationInMemoryRepository;
  let passwordManager: Argon2PasswordManager;

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

        ValidateAuthenticationService,
      ],
    }).compile();

    service = module.get<ValidateAuthenticationService>(
      ValidateAuthenticationService,
    );
    repository = module.get<AuthenticationInMemoryRepository>(
      AUTHENTICATION_REPOSITORY,
    );
    passwordManager = module.get<Argon2PasswordManager>(PASSWORD_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(() => {
    repository.authentications = [];
  });

  it('should return AuthenticationInvalidEmailError if email is not found', async () => {
    const authenticationQuery = new ValidateAuthenticationQuery({
      email: 'test@gmail.com',
      password: 'password',
    });

    const result: Result<EntityID, AuthenticationError> =
      await service.execute(authenticationQuery);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(AuthenticationInvalidEmailError);
  });

  it('should return AuthenticationInvalidPasswordError if password is wrong', async () => {
    await repository.save(
      await Authentication.create({
        email: 'test@gmail.com',
        password: await passwordManager.hashPassword('password'),
        bookerId: randomUUID(),
      }),
    );

    const authenticationQuery = new ValidateAuthenticationQuery({
      email: 'test@gmail.com',
      password: 'wrongPassword',
    });

    const result: Result<EntityID, AuthenticationError> =
      await service.execute(authenticationQuery);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(
      AuthenticationInvalidPasswordError,
    );
  });

  it('should return Authentication ID', async () => {
    await repository.save(
      await Authentication.create({
        email: 'test@gmail.com',
        password: await passwordManager.hashPassword('password'),
        bookerId: randomUUID(),
      }),
    );

    const authenticationQuery = new ValidateAuthenticationQuery({
      email: 'test@gmail.com',
      password: 'password',
    });

    const result: Result<EntityID, AuthenticationError> =
      await service.execute(authenticationQuery);
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).not.toBeNull();
  });
});
