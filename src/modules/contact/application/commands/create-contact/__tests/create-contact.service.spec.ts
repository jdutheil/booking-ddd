import { Test, TestingModule } from '@nestjs/testing';
import { ContactEmailAlreadyExistsError } from '@src/modules/contact/domain/contact.errors';
import { ContactInMemoryRepository } from '@src/modules/contact/infrastructure/persistence/contact.in-memory.repository';
import { CONTACT_REPOSITORY } from '@src/modules/contact/infrastructure/persistence/contact.repository';
import { Some } from 'oxide.ts';
import { CreateContactCommand } from '../create-contact.command';
import { CreateContactService } from '../create-contact.service';

describe('Create Contact Service', () => {
  let service: CreateContactService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateContactService,

        {
          provide: CONTACT_REPOSITORY,
          useClass: ContactInMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<CreateContactService>(CreateContactService);
  });

  describe('execute', () => {
    it('should return an error if email already exists', async () => {
      // Arrange
      const command = new CreateContactCommand({
        firstName: Some('John'),
        lastName: Some('Doe'),
        email: Some('john.doe@mail.com'),
        phone: Some('1234567890'),
      });

      // Act
      const result = await service.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(ContactEmailAlreadyExistsError);
    });
  });
});
