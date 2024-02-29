import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { ContactPrismaRepository } from '../../contact.prisma.repository';

describe('ContactPrismaRepository Integration Test', () => {
  let contactPrismaRepository: ContactPrismaRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ContactPrismaRepository],
    }).compile();

    contactPrismaRepository = module.get<ContactPrismaRepository>(
      ContactPrismaRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    const deleteBooker = prismaService.booker.deleteMany();
    const deleteContact = prismaService.contact.deleteMany();
    await prismaService.$transaction([deleteBooker, deleteContact]);
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(contactPrismaRepository).toBeDefined();
  });
});
