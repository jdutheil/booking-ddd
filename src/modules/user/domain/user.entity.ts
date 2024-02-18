import { AggregateID, Entity } from '@libs/ddd';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { CreateUserProps, UserProps } from './user.types';

export class UserEntity extends Entity<UserProps> {
  protected readonly _id!: AggregateID;

  static async create(create: CreateUserProps): Promise<UserEntity> {
    const id = randomUUID();
    const props: UserProps = {
      email: create.email,
      hashedPassword: await this.getHashedPassword(create.password),
    };
    const user = new UserEntity({ id, props });
    return user;
  }

  private static async getHashedPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  public async comparePassword(password: string): Promise<boolean> {
    return argon2.verify(this._props.hashedPassword, password);
  }

  validate(): void {}

  get email(): string {
    return this._props.email;
  }
}
