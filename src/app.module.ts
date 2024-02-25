import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BookerModule } from '@src/modules/booker/booker.module';
import { RestApiModule } from './infrastructure/rest-api/rest-api.module';

@Module({
  imports: [
    // TODO : validate environment with zod
    // TODO : abstract config module to not depends on it
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    EventEmitterModule.forRoot(),

    RestApiModule,

    BookerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
