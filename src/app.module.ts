import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BookerModule } from '@src/domains/booker/booker.module';
import { ContactModule } from './domains/contacts/contact/contact.module';
import { OrganizerModule } from './domains/contacts/organizer/organizer.module';
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
    ContactModule,
    OrganizerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
