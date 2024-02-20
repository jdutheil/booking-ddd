import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { BookerEntity } from '@src/modules/booker/domain/booker.entity';
import {
  BookerAlreadyExistsError,
  BookerNotFoundError,
} from '@src/modules/booker/domain/booker.errors';
import { BookerMapper } from '@src/modules/booker/domain/booker.mapper';
import { BookerPrismaRepository } from '../../booker.prisma-repository';

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

  describe('save', () => {
    beforeEach(async () => {
      await prismaService.booker.deleteMany();
    });

    it('should save a booker', async () => {
      const booker = await BookerEntity.create({
        email: 'booker@mail.com',
        password: 'password',
      });

      const bookerCount = await prismaService.booker.count();
      await bookerPrismaRepository.save(booker);
      const newBookerCount = await prismaService.booker.count();

      expect(newBookerCount).toBe(bookerCount + 1);
      const newBooker = await prismaService.booker.findUnique({
        where: { id: booker.id },
      });
      expect(newBooker).not.toBeNull();
      expect(newBooker?.id).toBe(booker.id);
      expect(newBooker?.email).toBe(booker.email);
      expect(newBooker?.hashedPassword).toBe(booker.hashedPassword);
    });

    it('should throw BookerAlreadyExists if booker already exists', async () => {
      const booker = await BookerEntity.create({
        email: 'booker@mail.com',
        password: 'password',
      });

      await bookerPrismaRepository.save(booker);

      let hasThrown = false;
      try {
        await bookerPrismaRepository.save(booker);
      } catch (error: any) {
        hasThrown = true;
        expect(error instanceof BookerAlreadyExistsError).toBe(true);
        expect(error.message).toBe(BookerAlreadyExistsError.message);
      }
      expect(hasThrown).toBe(true);
    });
  });

  describe('read tests', () => {
    let booker: BookerEntity;

    beforeAll(async () => {
      await prismaService.booker.deleteMany();

      booker = await BookerEntity.create({
        email: 'booker@mail.com',
        password: 'password',
      });
      await bookerPrismaRepository.save(booker);
    });

    describe('findOneById', () => {
      it('should find a booker by id', async () => {
        const foundBooker = await bookerPrismaRepository.findOneById(booker.id);
        expect(foundBooker.isSome()).toBe(true);
        expect(foundBooker.unwrap().id).toBe(booker.id);
        expect(foundBooker.unwrap().email).toBe(booker.email);
        expect(foundBooker.unwrap().hashedPassword).toBe(booker.hashedPassword);
      });

      it('should return None if booker not found', async () => {
        const foundBooker =
          await bookerPrismaRepository.findOneById('invalid-id');
        expect(foundBooker.isNone()).toBe(true);
      });
    });

    describe('findOneByEmail', () => {
      it('should find a booker by email', async () => {
        const foundBooker = await bookerPrismaRepository.findOneByEmail(
          booker.email,
        );
        expect(foundBooker.isSome()).toBe(true);
        expect(foundBooker.unwrap().id).toBe(booker.id);
        expect(foundBooker.unwrap().email).toBe(booker.email);
        expect(foundBooker.unwrap().hashedPassword).toBe(booker.hashedPassword);
      });

      it('should return None if booker not found', async () => {
        const foundBooker =
          await bookerPrismaRepository.findOneByEmail('invalid-email');
        expect(foundBooker.isNone()).toBe(true);
      });
    });

    describe('findAll', () => {
      it('should find all bookers', async () => {
        const bookers = await bookerPrismaRepository.findAll();
        expect(bookers.length).toBe(1);
        expect(bookers[0].id).toBe(booker.id);
        expect(bookers[0].email).toBe(booker.email);
        expect(bookers[0].hashedPassword).toBe(booker.hashedPassword);
      });
    });

    describe('findAllPaginated', () => {
      it('should find all bookers paginated', async () => {
        const bookers = await bookerPrismaRepository.findAllPaginated({
          limit: 10,
          page: 1,
          offset: 0,
          orderBy: { field: true, param: 'asc' },
        });
        expect(bookers.count).toBe(1);
        expect(bookers.limit).toBe(10);
        expect(bookers.page).toBe(1);
        expect(bookers.data.length).toBe(1);
        expect(bookers.data[0].id).toBe(booker.id);
        expect(bookers.data[0].email).toBe(booker.email);
        expect(bookers.data[0].hashedPassword).toBe(booker.hashedPassword);
      });
    });

    afterAll(async () => {
      await prismaService.booker.deleteMany();
    });
  });

  describe('delete', () => {
    let booker: BookerEntity;

    beforeAll(async () => {
      await prismaService.booker.deleteMany();

      booker = await BookerEntity.create({
        email: 'booker@mail.com',
        password: 'password',
      });
      await bookerPrismaRepository.save(booker);
    });

    it('should delete a booker', async () => {
      const bookerCount = await prismaService.booker.count();
      const deleted = await bookerPrismaRepository.delete(booker);
      const newBookerCount = await prismaService.booker.count();

      expect(deleted).toBe(true);
      expect(newBookerCount).toBe(bookerCount - 1);
    });

    it('should throw BookerNotFound if booker not found', async () => {
      let hasThrown = false;
      try {
        await bookerPrismaRepository.delete(
          await BookerEntity.create({
            email: 'other@mail.com',
            password: 'password',
          }),
        );
      } catch (error: any) {
        hasThrown = true;
        expect(error instanceof BookerNotFoundError).toBe(true);
        expect(error.message).toBe(BookerNotFoundError.message);
      }
      expect(hasThrown).toBe(true);
    });
  });
});
