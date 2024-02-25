import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RegisterBookerHttpController } from './booker/register-booker/register-booker.http.controller';

@Module({
  imports: [CqrsModule, EventEmitterModule.forRoot()],

  controllers: [RegisterBookerHttpController],
})
export class RestApiModule {}
