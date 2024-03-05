import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { AuthenticationHttpController } from './application/authentication.http-controller';
import { CreateAuthenticationService } from './application/commands/create-authentication/create-authentication.service';
import { CreateAuthenticationWhenBookerRegisteredEventHandler } from './application/events-handlers/create-authentication-when-booker-registered.event-handler';
import { AUTHENTICATION_REPOSITORY } from './application/ports/authentication.repository.port';
import { PASSWORD_MANAGER } from './application/ports/password-manager.port';
import { GetBookerIdForAuthenticationQueryHandler } from './application/queries/get-booker-id-for-authentication/get-booker-id-for-authentication.handler';
import { AuthenticationMapper } from './domain/authentication.mapper';
import { Argon2PasswordManager } from './infrastructure/argon2-password-manager';
import { AuthenticationPrismaRepository } from './infrastructure/database/authentication.prisma-repository';

const imports = [CqrsModule, ConfigModule];

const infrastructureProviders: Provider[] = [
  {
    provide: PASSWORD_MANAGER,
    useClass: Argon2PasswordManager,
  },
];

const orms: Provider[] = [
  PrismaService,

  {
    provide: AUTHENTICATION_REPOSITORY,
    useClass: AuthenticationPrismaRepository,
  },
];

const commandHandlers: Provider[] = [CreateAuthenticationService];
const queryHandlers: Provider[] = [GetBookerIdForAuthenticationQueryHandler];
const eventHandlers: Provider[] = [
  CreateAuthenticationWhenBookerRegisteredEventHandler,
];

const mappers: Provider[] = [AuthenticationMapper];

const httpControllers = [AuthenticationHttpController];

@Module({
  imports: [...imports],
  providers: [
    ...infrastructureProviders,
    ...orms,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...mappers,
  ],
  controllers: [...httpControllers],
})
export class AuthenticationModule {}
