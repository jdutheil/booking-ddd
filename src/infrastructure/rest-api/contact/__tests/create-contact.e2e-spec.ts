import { ConsoleLogger, HttpStatus, INestApplication } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { mainConfig } from '@src/main.config';
import * as request from 'supertest';
import { AuthenticationCreatedEvent } from '../../authentication/domain/events/authentication-created.event';

class AuthenticationCreatedInterceptor {
  eventReceived: boolean = false;

  @OnEvent(AuthenticationCreatedEvent.name)
  async handle() {
    this.eventReceived = true;
  }
}

describe('Create Contact', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let authenticationCreatedInterceptor: AuthenticationCreatedInterceptor;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AuthenticationCreatedInterceptor],
    })
      .setLogger(new ConsoleLogger())
      .compile();

    app = module.createNestApplication();
    mainConfig(app);
    await app.init();

    prisma = module.get<PrismaService>(PrismaService);
    authenticationCreatedInterceptor =
      module.get<AuthenticationCreatedInterceptor>(
        AuthenticationCreatedInterceptor,
      );
  });

  afterAll(async () => {
    const deleteContacts = prisma.contact.deleteMany();
    const deleteAuth = prisma.authentication.deleteMany();
    const deleteBookers = prisma.booker.deleteMany();

    await prisma.$transaction([deleteContacts, deleteAuth, deleteBookers]);
    await prisma.$disconnect();
    await app.close();
  });

  afterEach(async () => {
    await prisma.contact.deleteMany();
  });

  describe('Contact creation', () => {
    const credentials = {
      email: 'john.doe@mail.com',
      password: '$tr0ngP@ssw0rd',
    };
    let accessToken: string;

    beforeAll(async () => {
      // Register booker
      const { body } = await request(app.getHttpServer())
        .post('/v1/bookers')
        .send(credentials)
        .expect(HttpStatus.CREATED);

      expect(body.id).not.toBeNull();

      // Wait for AuthenticationCreatedEvent
      const authenticationEventReceived = await new Promise<boolean>(
        (resolve) => {
          let interval: NodeJS.Timeout;
          let timeout: NodeJS.Timeout;

          const clearAndResolve = (value: boolean) => {
            clearInterval(interval);
            clearTimeout(timeout);
            resolve(value);
          };

          if (!authenticationCreatedInterceptor.eventReceived) {
            interval = setInterval(() => {
              if (authenticationCreatedInterceptor.eventReceived) {
                clearAndResolve(true);
              }
            }, 100);

            timeout = setTimeout(() => {
              clearAndResolve(false);
            }, 5000);
          } else {
            resolve(true);
          }
        },
      );
      if (!authenticationEventReceived) {
        throw new Error('AuthenticationCreatedEvent not received');
      }
    });

    beforeEach(async () => {
      // Sign in to get access token
      const { body } = await request(app.getHttpServer())
        .post('/v1/auth/signin')
        .send(credentials)
        .expect(HttpStatus.CREATED);

      expect(body.accessToken).not.toBeNull();
      accessToken = body.accessToken;
    });

    afterEach(async () => {
      await prisma.contact.deleteMany();
    });

    afterAll(async () => {
      const deleteAuth = prisma.authentication.deleteMany();
      const deleteBookers = prisma.booker.deleteMany();
      await prisma.$transaction([deleteAuth, deleteBookers]);
    });

    it('should create a contact', async () => {
      // Arrange
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@mail.com',
        phone: '1234567890',
      };
      const contactsCount = await prisma.contact.count();

      // Act
      const { body } = await request(app.getHttpServer())
        .post('/v1/contacts')
        .send(contact)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.CREATED);
      const newContactsCount = await prisma.contact.count();

      // Assert
      expect(body.id).not.toBeNull();
      expect(newContactsCount).toBe(contactsCount + 1);
    });
  });
});
