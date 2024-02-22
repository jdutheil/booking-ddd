import { OrderBy, PaginatedQueryParams } from './repository.port';

export abstract class QueryBase {}

export abstract class PaginatedQueryBase extends QueryBase {
  limit: number;
  offset: number;
  orderBy: OrderBy;
  page: number;

  constructor(props: PaginatedParams<PaginatedQueryParams>) {
    super();
    this.limit = props.limit || 20;
    this.offset = props.page ? props.page * this.limit : 0;
    this.page = props.page || 0;
    this.orderBy = props.orderBy || { field: true, param: 'desc' };
  }
}

export type PaginatedParams<T> = Omit<
  T,
  'limit' | 'offset' | 'orderBy' | 'page'
> &
  Partial<Omit<PaginatedQueryParams, 'offset'>>;
