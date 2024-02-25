import { AggregateID } from '@src/libs/ddd';
import { QueryBase } from '@src/libs/ddd/query.base';
import { RefreshToken } from '../../ports/jwt-service.port';

export class ValidateRefreshTokenQuery extends QueryBase {
  readonly authenticationId: AggregateID;
  readonly refreshToken: RefreshToken;

  constructor(props: ValidateRefreshTokenQuery) {
    super();

    this.authenticationId = props.authenticationId;
    this.refreshToken = props.refreshToken;
  }
}
