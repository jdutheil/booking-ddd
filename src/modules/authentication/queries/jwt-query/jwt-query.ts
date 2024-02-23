import { AggregateID } from '@src/libs/ddd';
import { QueryBase } from '@src/libs/ddd/query.base';

export class JwtQuery extends QueryBase {
  readonly id: AggregateID;

  constructor(id: AggregateID) {
    super();
    this.id = id;
  }
}
