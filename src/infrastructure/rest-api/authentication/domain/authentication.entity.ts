import { Entity, EntityID } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { None, Option, Some } from 'oxide.ts';
import {
  AuthenticationProps,
  CreateAuthenticationProps,
} from './authentication.types';

export class AuthenticationEntity extends Entity<AuthenticationProps> {
  protected readonly _id!: EntityID;

  static async create(
    create: CreateAuthenticationProps,
  ): Promise<AuthenticationEntity> {
    const id = randomUUID();
    const props: AuthenticationProps = {
      bookerId: create.bookerId,
      email: create.email,
      password: create.password,
      accessToken: None,
      refreshToken: None,
    };
    const authentication = new AuthenticationEntity({ id, props });
    return authentication;
  }

  validate() {}

  get bookerId(): EntityID {
    return this._props.bookerId;
  }

  get email(): string {
    return this._props.email;
  }

  get password(): string {
    return this._props.password;
  }

  get accessToken(): Option<string> {
    return this._props.accessToken;
  }

  get refreshToken(): Option<string> {
    return this._props.refreshToken;
  }

  set refreshToken(refreshToken: string) {
    this._props.refreshToken = Some(refreshToken);
  }

  clearRefreshToken(): void {
    this._props.refreshToken = None;
  }
}
