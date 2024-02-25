import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtAuthenticationGuard } from './authentication/infrastructure/security/jwt-authentication.guard';
import { RegisterBookerHttpController } from './booker/register-booker/register-booker.http.controller';

@Module({
  imports: [CqrsModule, EventEmitterModule.forRoot(), AuthenticationModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticationGuard,
    },
  ],
  controllers: [RegisterBookerHttpController],
})
export class RestApiModule {}
