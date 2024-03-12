import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { EntityID } from '@src/libs/ddd';
import { GetBookerIdForUserIdQuery } from '../../application/queries/get-booker-id-for-user-id/get-booker-id-for-user-id.query';

@Injectable()
export class BookerIdFromUserIdPipe implements PipeTransform {
  constructor(private queryBus: QueryBus) {}

  async transform(userId: string): Promise<EntityID> {
    const bookerIdResult = await this.queryBus.execute(
      new GetBookerIdForUserIdQuery(userId),
    );
    if (bookerIdResult.isErr()) {
      throw new UnauthorizedException('Booker not found');
    }

    return bookerIdResult.unwrap();
  }
}
