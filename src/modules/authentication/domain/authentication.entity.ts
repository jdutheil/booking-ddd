import { AggregateID, Entity } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import {
  AuthenticationProps,
  CreateAuthenticationProps,
} from './authentication.types';

export class AuthenticationEntity extends Entity<AuthenticationProps> {
  protected readonly _id!: AggregateID;

  static async create(
    create: CreateAuthenticationProps,
  ): Promise<AuthenticationEntity> {
    const id = randomUUID();
    const props: AuthenticationProps = {
      bookerId: create.bookerId,
      email: create.email,
      password: create.password,
    };
    const authentication = new AuthenticationEntity({ id, props });
    return authentication;
  }

  validate() {}

  get bookerId(): AggregateID {
    return this._props.bookerId;
  }

  get email(): string {
    return this._props.email;
  }

  get password(): string {
    return this._props.password;
  }
}
