import { QueryBase } from '@src/libs/ddd';
import { UserId } from '../../../domain/authentication.entity';

export class GetBookerIdForUserIdQuery extends QueryBase {
  readonly userId: UserId;

  constructor(userId: UserId) {
    super();
    this.userId = userId;
  }
}
