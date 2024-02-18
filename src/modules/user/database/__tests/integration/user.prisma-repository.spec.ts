import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@src/infrastructure/prisma/prisma.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { UserEntity } from '@src/modules/user/domain/user.entity';
import { UserAlreadyExistsError } from '@src/modules/user/domain/user.errors';
import { UserMapper } from '@src/modules/user/domain/user.mapper';
import { UserPrismaRepository } from '../../user.prisma-repository';

describe('UserPrismaRepository Integration Test', () => {
  let userPrismaRepository: UserPrismaRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserMapper, UserPrismaRepository],
    }).compile();

    userPrismaRepository =
      module.get<UserPrismaRepository>(UserPrismaRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    const deleteUser = prismaService.user.deleteMany();
    await prismaService.$transaction([deleteUser]);
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(userPrismaRepository).toBeDefined();
  });

  describe('save', () => {
    beforeEach(async () => {
      await prismaService.user.deleteMany();
    });

    it('should save a user', async () => {
      const user = await UserEntity.create({
        email: 'user@mail.com',
        password: 'password',
      });

      const userCount = await prismaService.user.count();
      await userPrismaRepository.save(user);
      const newUserCount = await prismaService.user.count();

      expect(newUserCount).toBe(userCount + 1);
      const newUser = await prismaService.user.findUnique({
        where: { id: user.id },
      });
      expect(newUser).not.toBeNull();
      expect(newUser?.id).toBe(user.id);
      expect(newUser?.email).toBe(user.email);
      expect(newUser?.hashedPassword).toBe(user.hashedPassword);
    });

    it('should throw UserAlreadyExists if user already exists', async () => {
      const user = await UserEntity.create({
        email: 'user@mail.com',
        password: 'password',
      });

      await userPrismaRepository.save(user);

      let hasThrown = false;
      try {
        await userPrismaRepository.save(user);
      } catch (error: any) {
        hasThrown = true;
        expect(error instanceof UserAlreadyExistsError).toBe(true);
        expect(error.message).toBe(UserAlreadyExistsError.message);
      }
      expect(hasThrown).toBe(true);
    });
  });

  describe('read tests', () => {
    let user: UserEntity;

    beforeAll(async () => {
      await prismaService.user.deleteMany();

      user = await UserEntity.create({
        email: 'user@mail.com',
        password: 'password',
      });
      await userPrismaRepository.save(user);
    });

    describe('findOneById', () => {
      it('should find a user by id', async () => {
        const foundUser = await userPrismaRepository.findOneById(user.id);
        expect(foundUser.isSome()).toBe(true);
        expect(foundUser.unwrap().id).toBe(user.id);
        expect(foundUser.unwrap().email).toBe(user.email);
        expect(foundUser.unwrap().hashedPassword).toBe(user.hashedPassword);
      });

      it('should return None if user not found', async () => {
        const foundUser = await userPrismaRepository.findOneById('invalid-id');
        expect(foundUser.isNone()).toBe(true);
      });
    });

    describe('findOneByEmail', () => {
      it('should find a user by email', async () => {
        const foundUser = await userPrismaRepository.findOneByEmail(user.email);
        expect(foundUser.isSome()).toBe(true);
        expect(foundUser.unwrap().id).toBe(user.id);
        expect(foundUser.unwrap().email).toBe(user.email);
        expect(foundUser.unwrap().hashedPassword).toBe(user.hashedPassword);
      });

      it('should return None if user not found', async () => {
        const foundUser =
          await userPrismaRepository.findOneByEmail('invalid-email');
        expect(foundUser.isNone()).toBe(true);
      });
    });

    describe('findAll', () => {
      it('should find all users', async () => {
        const users = await userPrismaRepository.findAll();
        expect(users.length).toBe(1);
        expect(users[0].id).toBe(user.id);
        expect(users[0].email).toBe(user.email);
        expect(users[0].hashedPassword).toBe(user.hashedPassword);
      });
    });

    describe('findAllPaginated', () => {
      it('should find all users paginated', async () => {
        const users = await userPrismaRepository.findAllPaginated({
          limit: 10,
          page: 1,
          offset: 0,
          orderBy: { field: true, param: 'asc' },
        });
        expect(users.count).toBe(1);
        expect(users.limit).toBe(10);
        expect(users.page).toBe(1);
        expect(users.data.length).toBe(1);
        expect(users.data[0].id).toBe(user.id);
        expect(users.data[0].email).toBe(user.email);
        expect(users.data[0].hashedPassword).toBe(user.hashedPassword);
      });
    });

    afterAll(async () => {
      await prismaService.user.deleteMany();
    });
  });

  describe('delete', () => {
    let user: UserEntity;

    beforeAll(async () => {
      await prismaService.user.deleteMany();

      user = await UserEntity.create({
        email: 'user@mail.com',
        password: 'password',
      });
      await userPrismaRepository.save(user);
    });

    it('should delete a user', async () => {
      const userCount = await prismaService.user.count();
      const deleted = await userPrismaRepository.delete(user);
      const newUserCount = await prismaService.user.count();

      expect(deleted).toBe(true);
      expect(newUserCount).toBe(userCount - 1);
    });

    it('should return false if user not found', async () => {
      const userCount = await prismaService.user.count();
      const deleted = await userPrismaRepository.delete(
        await UserEntity.create({
          email: 'other@mail.com',
          password: 'password',
        }),
      );
      const newUserCount = await prismaService.user.count();

      expect(deleted).toBe(false);
      expect(newUserCount).toBe(userCount);
    });
  });
});
