import { EntityID, QueryBase } from '@src/libs/ddd';

export class FindOrganizersForBookerQuery extends QueryBase {
  readonly bookerId: EntityID;

  constructor(bookerId: EntityID) {
    super();
    this.bookerId = bookerId;
  }
}
