import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { mainConfig } from '@src/main.config';
import * as request from 'supertest';

const USERS_ROOT = '/v1/bookers';
const VALID_EMAIL = 'booker@gmail.com';
const VALID_PASSWORD = '$str0ngP@ssw0rd';
const INVALID_EMAIL = 'invalid-email';
const INVALID_PASSWORD = 'password';

describe('CreateBooker E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    mainConfig(app);
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.authentication.deleteMany();
    await prisma.booker.deleteMany();
  });

  describe('Bookers creation', () => {
    it('should throw BAD_REQUEST when email is invalid', async () => {
      await request(app.getHttpServer())
        .post(USERS_ROOT)
        .send({
          email: INVALID_EMAIL,
          password: VALID_PASSWORD,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should throw BAD_REQUEST when password is invalid', async () => {
      await request(app.getHttpServer())
        .post(USERS_ROOT)
        .send({
          email: VALID_EMAIL,
          password: INVALID_PASSWORD,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should create a booker', async () => {
      const bookersCount = await prisma.booker.count();

      const { body } = await request(app.getHttpServer())
        .post(USERS_ROOT)
        .send({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
        })
        .expect(HttpStatus.CREATED);

      expect(body).toBeDefined();
      expect(body.id).not.toBeNull();

      const newBookersCount = await prisma.booker.count();

      expect(newBookersCount).toBe(bookersCount + 1);
    });

    it('should throw CONFLICT when booker already exists', async () => {
      await request(app.getHttpServer())
        .post(USERS_ROOT)
        .send({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
        })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .post(USERS_ROOT)
        .send({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
        })
        .expect(HttpStatus.CONFLICT);
    });
  });
});
