import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { AUTHENTICATION_REPOSITORY } from './application/ports/authentication.repository.port';
import { PASSWORD_MANAGER } from './application/ports/password-manager.port';
import { CreateAuthenticationService } from './commands/create-authentication/create-authentication.service';
import { AuthenticationMapper } from './domain/authentication.mapper';
import { Argon2PasswordManager } from './infrastructure/argon2-password-manager';
import { AuthenticationPrismaRepository } from './infrastructure/database/authentication.prisma-repository';

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

const mappers: Provider[] = [AuthenticationMapper];

@Module({
  imports: [CqrsModule],
  providers: [
    ...infrastructureProviders,
    ...orms,
    ...commandHandlers,
    ...mappers,
  ],
})
export class AuthenticationModule {}
