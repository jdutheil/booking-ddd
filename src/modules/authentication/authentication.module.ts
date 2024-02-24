import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { AuthenticationHttpController } from './application/authentication.http-controller';
import { AUTHENTICATION_REPOSITORY } from './application/ports/authentication.repository.port';
import { JWT_SERVICE } from './application/ports/jwt-service.port';
import { PASSWORD_MANAGER } from './application/ports/password-manager.port';
import { CreateAuthenticationService } from './commands/create-authentication/create-authentication.service';
import { AuthenticationMapper } from './domain/authentication.mapper';
import { CreateAuthenticationWhenBookerCreatedEventHandler } from './events-handlers/create-authentication-when-booker-created.event-handler';
import { Argon2PasswordManager } from './infrastructure/argon2-password-manager';
import { AuthenticationPrismaRepository } from './infrastructure/database/authentication.prisma-repository';
import { JwtRefreshStrategy } from './infrastructure/security/jwt-refresh.strategy';
import { JwtStrategy } from './infrastructure/security/jwt.strategy';
import { LocalStrategy } from './infrastructure/security/local.strategy';
import { NestJwtService } from './infrastructure/security/nest-jwt-service';
import { JwtQueryHandler } from './queries/jwt-query/jwt-query.handler';
import { ValidateAuthenticationService } from './queries/validate-authentication/validate-authentication.service';

const imports = [CqrsModule, JwtModule.register({}), PassportModule];

const infrastructureProviders: Provider[] = [
  {
    provide: PASSWORD_MANAGER,
    useClass: Argon2PasswordManager,
  },

  {
    provide: JWT_SERVICE,
    useClass: NestJwtService,
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
const queryHandlers: Provider[] = [
  ValidateAuthenticationService,
  JwtQueryHandler,
];
const eventHandlers: Provider[] = [
  CreateAuthenticationWhenBookerCreatedEventHandler,
];

const mappers: Provider[] = [AuthenticationMapper];

const securityStrategies: Provider[] = [
  LocalStrategy,
  JwtStrategy,
  JwtRefreshStrategy,
];

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
    ...securityStrategies,
  ],
  controllers: [...httpControllers],
})
export class AuthenticationModule {}
