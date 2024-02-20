import { Test, TestingModule } from '@nestjs/testing';
import { CreateAuthenticationService } from '../../create-authentication.service';

describe('CreateAuthenticationService Unit Tests', () => {
  let service: CreateAuthenticationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAuthenticationService],
    }).compile();

    service = module.get<CreateAuthenticationService>(
      CreateAuthenticationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
