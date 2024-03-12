import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { mainConfig } from '@src/main.config';
import * as request from 'supertest';

describe('Find Organizers for Booker', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let configService: ConfigService;

  let authenticationToken: string;
  let existingBookerId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    mainConfig(app);
    await app.init();

    prisma = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);

    const clerkToken = configService.get<string>('CLERK_TEST_TOKEN');
    const clerkUser = configService.get<string>('CLERK_TEST_USER');

    // TODO : DRY !!
    // Save Clerk Token
    if (!clerkToken) {
      throw new Error('CLERK_TEST_TOKEN not found');
    }
    authenticationToken = clerkToken;

    // Insert corresponding Booker / Authentication
    const booker = await prisma.booker.create({
      data: {
        email: 'test-booker@mail.com',
      },
    });
    existingBookerId = booker.id;

    if (!clerkUser) {
      throw new Error('CLERK_TEST_USER not found');
    }
    await prisma.authentication.create({
      data: {
        booker: {
          connect: {
            id: booker.id,
          },
        },
        userId: clerkUser,
      },
    });
  });

  afterAll(async () => {
    const deleteOrganizers = prisma.organizer.deleteMany();
    const deleteBookers = prisma.booker.deleteMany();
    const deleteAuthentications = prisma.authentication.deleteMany();

    await prisma.$transaction([
      deleteOrganizers,
      deleteBookers,
      deleteAuthentications,
    ]);
    await prisma.$disconnect();
    await app.close();
  });

  describe('GET /organizers', () => {
    afterEach(async () => {
      await prisma.organizer.deleteMany();
    });

    it('should find organizers for booker', async () => {
      // Arrange
      const organizers = await prisma.organizer.createMany({
        data: [
          {
            name: 'Organizer 1',
            bookerId: existingBookerId,
          },
          {
            name: 'Organizer 2',
            bookerId: existingBookerId,
          },
        ],
      });

      const otherBooker = await prisma.booker.create({
        data: {
          email: 'other-booker@mail.com',
        },
      });
      const otherOrganizer = await prisma.organizer.create({
        data: {
          name: 'Other organizer',
          bookerId: otherBooker.id,
        },
      });

      // Act
      const { status, body } = await request(app.getHttpServer())
        .get('/v1/organizers')
        .set('Authorization', `Bearer ${authenticationToken}`);

      expect(status).toBe(HttpStatus.OK);
      expect(body.data).not.toBeNull();
      expect(body.data.length).toBe(2);
    });
  });
});
