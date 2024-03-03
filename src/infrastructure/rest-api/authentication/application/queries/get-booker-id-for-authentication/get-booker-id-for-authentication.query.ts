import { EntityID, QueryBase } from '@src/libs/ddd';

export class GetBookerIdForAuthenticationQuery extends QueryBase {
  readonly authenticationId: EntityID;

  constructor(authenticationId: EntityID) {
    super();
    this.authenticationId = authenticationId;
  }
}
