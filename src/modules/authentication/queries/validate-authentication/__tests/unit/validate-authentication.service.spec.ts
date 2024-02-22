import { Test, TestingModule } from '@nestjs/testing';
import { AUTHENTICATION_REPOSITORY } from '@src/modules/authentication/application/ports/authentication.repository.port';
import { PASSWORD_MANAGER } from '@src/modules/authentication/application/ports/password-manager.port';
import { Argon2PasswordManager } from '@src/modules/authentication/infrastructure/argon2-password-manager';
import { AuthenticationInMemoryRepository } from '@src/modules/authentication/infrastructure/database/authentication.in-memory.repository';
import { ValidateAuthenticationService } from '../../validate-authentication.service';

describe('ValidateAuthenticationService Unit Tests', () => {
  let service: ValidateAuthenticationService;
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

        ValidateAuthenticationService,
      ],
    }).compile();

    service = module.get<ValidateAuthenticationService>(
      ValidateAuthenticationService,
    );
    repository = module.get<AuthenticationInMemoryRepository>(
      AUTHENTICATION_REPOSITORY,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
