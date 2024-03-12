import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthenticationModule } from './authentication/authentication.module';
import { ClerkGuard } from './authentication/infrastructure/security/clerk.guard';
import { CreateContactHttpController } from './contact/application/create-contact/create-contact.http.controller';
import { CreateOrganizerHttpController } from './organizer/application/create-organizer/create-organizer.http.controller';
import { FindOrganizersForBookerHttpController } from './organizer/application/find-organizers/find-organizers-for-booker.http.controller';

@Module({
  imports: [CqrsModule, EventEmitterModule.forRoot(), AuthenticationModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClerkGuard,
    },
  ],
  controllers: [
    CreateContactHttpController,
    CreateOrganizerHttpController,
    FindOrganizersForBookerHttpController,
  ],
})
export class RestApiModule {}
