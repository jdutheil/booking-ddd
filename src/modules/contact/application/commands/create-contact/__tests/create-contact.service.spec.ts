import { Test, TestingModule } from '@nestjs/testing';
import { CreateContactService } from '../create-contact.service';

describe('Create Contact Service', () => {
  let service: CreateContactService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateContactService],
    }).compile();

    service = module.get<CreateContactService>(CreateContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
