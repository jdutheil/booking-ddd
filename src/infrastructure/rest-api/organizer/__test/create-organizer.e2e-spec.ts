import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { mainConfig } from '@src/main.config';
import * as request from 'supertest';

describe('Create Organizer', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let configService: ConfigService;

  let authenticationToken: string;

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

  describe('POST /organizers', () => {
    it('should create a new organizer', async () => {
      const payload = {
        name: 'Organizer name',
      };
      const organizersCount = await prisma.organizer.count();

      const { status, body } = await request(app.getHttpServer())
        .post('/v1/organizers')
        .set('Authorization', `Bearer ${authenticationToken}`)
        .send(payload);

      console.log('status', status);
      console.log('body', body);

      expect(status).toEqual(HttpStatus.CREATED);
      expect(body.id).not.toBeNull();
      expect(await prisma.organizer.count()).toEqual(organizersCount + 1);
    });
  });
});
