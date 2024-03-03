import { EntityID } from '@src/libs/ddd';
import { QueryBase } from '@src/libs/ddd/query.base';

export class JwtQuery extends QueryBase {
  readonly id: EntityID;

  constructor(id: EntityID) {
    super();
    this.id = id;
  }
}
