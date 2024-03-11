import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { GetBookerIdForUserIdQuery } from '@src/infrastructure/rest-api/authentication/application/queries/get-booker-id-for-user-id/get-booker-id-for-user-id.query';
import { ApiErrorResponse, IdResponse } from '@src/libs/api';
import { EntityID } from '@src/libs/ddd';
import { CreateOrganizerCommand } from '@src/modules/organizer/application/commands/create-organizer/create-organizer.command';
import { OrganizerError } from '@src/modules/organizer/domain/organizer.errors';
import { Result } from 'oxide.ts';
import { CreateOrganizerRequest } from './create-organizer.request';

@Controller(routesV1.version)
export class CreateOrganizerHttpController {
  private logger: Logger = new Logger(CreateOrganizerHttpController.name);

  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

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
    @Req() req: any,
  ): Promise<IdResponse> {
    const userId = req.auth.userId;

    const bookerIdResult: Result<EntityID, Error> = await this.queryBus.execute(
      new GetBookerIdForUserIdQuery(userId),
    );
    if (bookerIdResult.isErr()) {
      console.error('userId:', userId);
      throw new NotFoundException('Booker not found');
    }
    const bookerId = bookerIdResult.unwrap();

    this.logger.debug(
      `CreateOrganizerHttpController::createOrganizer - Booker ID: ${bookerId}`,
    );

    const result: Result<EntityID, OrganizerError> =
      await this.commandBus.execute(
        new CreateOrganizerCommand({
          bookerId,
          name: createOrganizerRequest.name,
          contactIds: createOrganizerRequest.contactIds ?? [],
        }),
      );

    if (result.isErr()) {
      throw new BadRequestException(result.unwrapErr().message);
    }

    return new IdResponse(result.unwrap());
  }
}
