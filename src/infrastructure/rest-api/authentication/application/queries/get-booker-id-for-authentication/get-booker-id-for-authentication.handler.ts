import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { EntityID } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { GetBookerIdForAuthenticationQuery } from './get-booker-id-for-authentication.query';

@QueryHandler(GetBookerIdForAuthenticationQuery)
export class GetBookerIdForAuthenticationQueryHandler
  implements IQueryHandler<GetBookerIdForAuthenticationQuery>
{
  // TODO : Move to a repository !!
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetBookerIdForAuthenticationQuery,
  ): Promise<Result<EntityID, Error>> {
    const authentication = await this.prismaService.authentication.findUnique({
      where: { id: query.authenticationId },
      select: { bookerId: true },
    });

    if (!authentication) {
      return Err(new Error('Authentication not found'));
    }

    return Ok(authentication.bookerId);
  }
}
