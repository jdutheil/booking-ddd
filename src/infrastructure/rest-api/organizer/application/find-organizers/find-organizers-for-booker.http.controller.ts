import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { Auth } from '@src/infrastructure/rest-api/authentication/infrastructure/security/auth.decorator';
import { BookerIdFromUserIdPipe } from '@src/infrastructure/rest-api/authentication/infrastructure/security/booker-id-from-user-id.pipe';
import { EntityID } from '@src/libs/ddd';
import { FindOrganizersForBookerQuery } from '@src/modules/organizer/application/queries/find-organizers-for-booker/find-organizers-for-booker.query';
import { Organizer } from '@src/modules/organizer/domain/organizer.entity';
import { OrganizerError } from '@src/modules/organizer/domain/organizer.errors';
import { Result } from 'oxide.ts';
import { OrganizerResponse, OrganizersResponse } from './organizers.response';

@Controller(routesV1.version)
export class FindOrganizersForBookerHttpController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({
    summary: 'Find organizers for booker',
    description: 'Find organizers for logged-in Booker',
    tags: ['organizer'],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrganizersResponse,
  })
  @Get(routesV1.organizer.root)
  async findOrganizersForBooker(
    @Auth(BookerIdFromUserIdPipe) bookerId: EntityID,
  ): Promise<OrganizersResponse> {
    const organizersResult: Result<Organizer[], OrganizerError> =
      await this.queryBus.execute(new FindOrganizersForBookerQuery(bookerId));
    if (organizersResult.isErr()) {
      throw new InternalServerErrorException(organizersResult.unwrapErr());
    }

    const organizers = organizersResult.unwrap();

    return new OrganizersResponse(
      organizers.map((organizer) => new OrganizerResponse(organizer)),
    );
  }
}
