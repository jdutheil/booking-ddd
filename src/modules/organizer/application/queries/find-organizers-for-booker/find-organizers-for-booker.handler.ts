import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Organizer } from '@src/modules/organizer/domain/organizer.entity';
import { OrganizerError } from '@src/modules/organizer/domain/organizer.errors';
import {
  ORGANIZER_REPOSITORY,
  OrganizerRepository,
} from '@src/modules/organizer/infrastructure/persistence/organizer.repository';
import { Err, Ok, Result } from 'oxide.ts';
import { FindOrganizersForBookerQuery } from './find-organizers-for-booker.query';

@QueryHandler(FindOrganizersForBookerQuery)
export class FindOrganizersForBookerQueryHandler
  implements IQueryHandler<FindOrganizersForBookerQuery>
{
  constructor(
    @Inject(ORGANIZER_REPOSITORY)
    private organizerRepository: OrganizerRepository,
  ) {}

  async execute(
    query: FindOrganizersForBookerQuery,
  ): Promise<Result<Organizer[], OrganizerError>> {
    const { bookerId } = query;

    try {
      const organizers =
        await this.organizerRepository.findAllForBooker(bookerId);
      return Ok(organizers);
    } catch (error) {
      return Err(new OrganizerError('Failed to find organizers for booker'));
    }
  }
}
