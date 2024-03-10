import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { AuthenticationHttpController } from './application/authentication.http-controller';
import { CreateAuthenticationService } from './application/commands/create-authentication/create-authentication.service';
import { AUTHENTICATION_REPOSITORY } from './application/ports/authentication.repository.port';
import { GetBookerIdForAuthenticationQueryHandler } from './application/queries/get-booker-id-for-authentication/get-booker-id-for-authentication.handler';
import { AuthenticationMapper } from './domain/authentication.mapper';
import { AuthenticationPrismaRepository } from './infrastructure/database/authentication.prisma-repository';

const imports = [CqrsModule, ConfigModule];

const orms: Provider[] = [
  PrismaService,

  {
    provide: AUTHENTICATION_REPOSITORY,
    useClass: AuthenticationPrismaRepository,
  },
];

const commandHandlers: Provider[] = [CreateAuthenticationService];
const queryHandlers: Provider[] = [GetBookerIdForAuthenticationQueryHandler];

const mappers: Provider[] = [AuthenticationMapper];

const httpControllers = [AuthenticationHttpController];

@Module({
  imports: [...imports],
  providers: [...orms, ...commandHandlers, ...queryHandlers, ...mappers],
  controllers: [...httpControllers],
})
export class AuthenticationModule {}
