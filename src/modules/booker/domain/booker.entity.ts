import { AggregateID, Entity } from '@libs/ddd';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { BookerProps, CreateBookerProps } from './booker.types';

export class BookerEntity extends Entity<BookerProps> {
  protected readonly _id!: AggregateID;

  static async create(create: CreateBookerProps): Promise<BookerEntity> {
    const id = randomUUID();
    const props: BookerProps = {
      email: create.email,
      hashedPassword: await this.getHashedPassword(create.password),
    };
    const booker = new BookerEntity({ id, props });
    return booker;
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

  get hashedPassword(): string {
    return this._props.hashedPassword;
  }
}
