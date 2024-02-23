import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookerModule } from '@src/modules/booker/booker.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [
    // TODO : validate environment with zod
    // TODO : abstract config module to not depends on it
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthenticationModule,
    BookerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
