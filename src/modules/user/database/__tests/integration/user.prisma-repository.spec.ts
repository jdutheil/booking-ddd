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
});
