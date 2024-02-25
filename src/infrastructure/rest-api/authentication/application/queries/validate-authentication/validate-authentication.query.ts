import { QueryBase } from '@src/libs/ddd/query.base';

export class ValidateAuthenticationQuery extends QueryBase {
  readonly email: string;
  readonly password: string;

  constructor(props: ValidateAuthenticationQuery) {
    super();
    this.email = props.email;
    this.password = props.password;
  }
}
