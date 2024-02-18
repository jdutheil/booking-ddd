import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@src/modules/user/user.module';

@Module({
  imports: [
    // TODO : validate environment with zod
    // TODO : abstrat config module to not depends on it
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
