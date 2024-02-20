import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { mainConfig } from '@src/main.config';
import * as request from 'supertest';

const USERS_ROOT = '/v1/users';
const VALID_EMAIL = 'user@gmail.com';
const VALID_PASSWORD = '$tr0ngP@ssw0rd';
const INVALID_EMAIL = 'invalid-email';
const INVALID_PASSWORD = 'password';

describe('CreateUser E2E', () => {
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
    await prisma.user.deleteMany();
  });

  describe('Users creation', () => {
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

    it('should create a user', async () => {
      const { body } = await request(app.getHttpServer())
        .post(USERS_ROOT)
        .send({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
        })
        .expect(HttpStatus.CREATED);

      expect(body).toBeDefined();
      expect(body.id).not.toBeNull();
    });

    it('should throw CONFLICT when user already exists', async () => {
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
