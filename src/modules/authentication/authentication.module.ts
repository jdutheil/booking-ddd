import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { AuthenticationHttpController } from './application/authentication.http-controller';
import { AUTHENTICATION_REPOSITORY } from './application/ports/authentication.repository.port';
import { PASSWORD_MANAGER } from './application/ports/password-manager.port';
import { CreateAuthenticationService } from './commands/create-authentication/create-authentication.service';
import { AuthenticationMapper } from './domain/authentication.mapper';
import { CreateAuthenticationWhenBookerCreatedEventHandler } from './events-handlers/create-authentication-when-booker-created.event-handler';
import { Argon2PasswordManager } from './infrastructure/argon2-password-manager';
import { AuthenticationPrismaRepository } from './infrastructure/database/authentication.prisma-repository';
import { JwtStrategy } from './infrastructure/security/jwt.strategy';
import { LocalStrategy } from './infrastructure/security/local.strategy';
import { JwtQueryHandler } from './queries/jwt-query/jwt-query.handler';
import { ValidateAuthenticationService } from './queries/validate-authentication/validate-authentication.service';

const imports = [
  CqrsModule,

  JwtModule.registerAsync({
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
    }),
    inject: [ConfigService],
  }),

  PassportModule,
];

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
const queryHandlers: Provider[] = [
  ValidateAuthenticationService,
  JwtQueryHandler,
];
const eventHandlers: Provider[] = [
  CreateAuthenticationWhenBookerCreatedEventHandler,
];

const mappers: Provider[] = [AuthenticationMapper];

const securityStrategies: Provider[] = [LocalStrategy, JwtStrategy];

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
