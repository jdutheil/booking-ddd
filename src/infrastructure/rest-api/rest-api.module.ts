import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthenticationModule } from './authentication/authentication.module';
import { RegisterBookerHttpController } from './booker/register-booker/register-booker.http.controller';

@Module({
  imports: [CqrsModule, EventEmitterModule.forRoot(), AuthenticationModule],

  controllers: [RegisterBookerHttpController],
})
export class RestApiModule {}
