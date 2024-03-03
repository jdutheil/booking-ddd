import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { Booker } from '@src/modules/booker/domain/booker.entity';
import { BookerAlreadyExistsError } from '@src/modules/booker/domain/booker.errors';
import { BookerMapper } from '@src/modules/booker/domain/booker.mapper';
import { BookerEmail } from '@src/modules/booker/domain/value-objects/booker-email';
import { BookerPrismaRepository } from './../../booker.prisma-repository';

describe('BookerPrismaRepository Integration Test', () => {
  let bookerPrismaRepository: BookerPrismaRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [BookerMapper, BookerPrismaRepository],
    }).compile();

    bookerPrismaRepository = module.get<BookerPrismaRepository>(
      BookerPrismaRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    const deleteBooker = prismaService.booker.deleteMany();
    await prismaService.$transaction([deleteBooker]);
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(bookerPrismaRepository).toBeDefined();
  });

  describe('register', () => {
    beforeEach(async () => {
      await prismaService.booker.deleteMany();
    });

    it('should register a new booker', async () => {
      const booker = Booker.create({
        email: BookerEmail.create('booker@mail.com').unwrap(),
      }).unwrap();

      const bookersCount = await prismaService.booker.count();
      await bookerPrismaRepository.register(booker);
      const newBookersCount = await prismaService.booker.count();

      expect(newBookersCount).toBe(bookersCount + 1);
      const newBooker = await prismaService.booker.findUnique({
        where: { id: booker.id },
      });
      expect(newBooker).not.toBeNull();
      expect(newBooker?.id).toBe(booker.id);
      expect(newBooker?.email).toBe(booker.email.value);
    });

    it('should throw BookerAlreadyExists if email is already in used', async () => {
      const booker = Booker.create({
        email: BookerEmail.create('booker@mail.com').unwrap(),
      }).unwrap();

      await bookerPrismaRepository.register(booker);
      await expect(bookerPrismaRepository.register(booker)).rejects.toThrow(
        BookerAlreadyExistsError,
      );
    });
  });
});
