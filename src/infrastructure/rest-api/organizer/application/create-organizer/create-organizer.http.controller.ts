import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { CreateOrganizerCommand } from '@src/domains/contacts/organizer/application/commands/create-organizer/create-organizer.command';
import { OrganizerError } from '@src/domains/contacts/organizer/domain/organizer.errors';
import { InvalidEmailError } from '@src/domains/contacts/shared/domain/errors';
import { Email } from '@src/domains/contacts/shared/domain/value-objects/email';
import { Auth } from '@src/infrastructure/rest-api/authentication/infrastructure/security/auth.decorator';
import { BookerIdFromUserIdPipe } from '@src/infrastructure/rest-api/authentication/infrastructure/security/booker-id-from-user-id.pipe';
import { ApiErrorResponse, IdResponse } from '@src/libs/api';
import { EntityID } from '@src/libs/ddd';
import { Result } from 'oxide.ts';
import { CreateOrganizerRequest } from './create-organizer.request';

@Controller(routesV1.version)
export class CreateOrganizerHttpController {
  private logger: Logger = new Logger(CreateOrganizerHttpController.name);

  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Create an organizer', tags: ['organizer'] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.organizer.root)
  async createOrganizer(
    @Body() createOrganizerRequest: CreateOrganizerRequest,
    @Auth(BookerIdFromUserIdPipe) bookerId: EntityID,
  ): Promise<IdResponse> {
    this.logger.debug(
      `CreateOrganizerHttpController::createOrganizer - Booker ID: ${bookerId}`,
    );

    const emails: Email[] = [];
    if (createOrganizerRequest.emails) {
      createOrganizerRequest.emails.forEach((email) => {
        const emailResult: Result<Email, InvalidEmailError> =
          Email.create(email);
        if (emailResult.isErr()) {
          throw new BadRequestException(emailResult.unwrapErr().message);
        }
        emails.push(emailResult.unwrap());
      });
    }

    const result: Result<EntityID, OrganizerError> =
      await this.commandBus.execute(
        new CreateOrganizerCommand({
          bookerId,
          name: createOrganizerRequest.name,
          type: createOrganizerRequest.type,
          emails: emails,
          phones: createOrganizerRequest.phones ?? [],
          contactIds: createOrganizerRequest.contactIds ?? [],
        }),
      );

    if (result.isErr()) {
      throw new BadRequestException(result.unwrapErr().message);
    }

    return new IdResponse(result.unwrap());
  }
}
