import { Test, TestingModule } from '@nestjs/testing';
import { AUTHENTICATION_REPOSITORY } from '@src/modules/authentication/application/ports/authentication.repository.port';
import { PASSWORD_MANAGER } from '@src/modules/authentication/application/ports/password-manager.port';
import { AuthenticationEntity } from '@src/modules/authentication/domain/authentication.entity';
import { Argon2PasswordManager } from '@src/modules/authentication/infrastructure/argon2-password-manager';
import { AuthenticationInMemoryRepository } from '@src/modules/authentication/infrastructure/database/authentication.in-memory.repository';
import { randomUUID } from 'crypto';
import { ValidateRefreshTokenQueryHandler } from '../../validate-refresh-token.query.handler';

describe('ValidateRefreshTokenQueryHandler', () => {
  let handler: ValidateRefreshTokenQueryHandler;
  let repository: AuthenticationInMemoryRepository;
  let passwordManager: Argon2PasswordManager;

  let authenticationEntity: AuthenticationEntity;

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

        ValidateRefreshTokenQueryHandler,
      ],
    }).compile();

    handler = module.get<ValidateRefreshTokenQueryHandler>(
      ValidateRefreshTokenQueryHandler,
    );
    repository = module.get<AuthenticationInMemoryRepository>(
      AUTHENTICATION_REPOSITORY,
    );
    passwordManager = module.get<Argon2PasswordManager>(PASSWORD_MANAGER);
  });

  beforeEach(async () => {
    repository.authentications = [];

    authenticationEntity = await AuthenticationEntity.create({
      email: 'test@mail.com',
      password: 'password',
      bookerId: randomUUID(),
    });
    await repository.save(authenticationEntity);
  });

  it('should return false if authentication does not exist', async () => {
    const result = await handler.execute({
      authenticationId: randomUUID(),
      refreshToken: 'random-token',
    });

    expect(result).toBe(false);
  });

  it("should return false if refreshToken doesn't match witht he one in the database", async () => {
    const plainRefreshToken = 'random-token';
    const hashedRefreshToken =
      await passwordManager.hashPassword(plainRefreshToken);
    authenticationEntity.refreshToken = hashedRefreshToken;

    await repository.update(authenticationEntity);

    const result = await handler.execute({
      authenticationId: authenticationEntity.id,
      refreshToken: 'wrong-token',
    });

    expect(result).toBe(false);
  });

  it('should return false if refreshToken is not set on Authentication', async () => {
    const result = await handler.execute({
      authenticationId: authenticationEntity.id,
      refreshToken: 'random-token',
    });

    expect(result).toBe(false);
  });

  it('should return true if refreshToken matches with the one in the database', async () => {
    const plainRefreshToken = 'random-token';
    const hashedRefreshToken =
      await passwordManager.hashPassword(plainRefreshToken);
    authenticationEntity.refreshToken = hashedRefreshToken;

    await repository.update(authenticationEntity);

    const result = await handler.execute({
      authenticationId: authenticationEntity.id,
      refreshToken: plainRefreshToken,
    });
    expect(result).toBe(true);
  });
});
