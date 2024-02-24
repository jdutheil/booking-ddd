import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BookerModule } from '@src/modules/booker/booker.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [
    // TODO : validate environment with zod
    // TODO : abstract config module to not depends on it
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    EventEmitterModule.forRoot(),

    AuthenticationModule,
    BookerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
