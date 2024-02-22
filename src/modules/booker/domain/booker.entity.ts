import { AggregateID, Entity } from '@libs/ddd';
import { randomUUID } from 'crypto';
import { BookerProps, CreateBookerProps } from './booker.types';

export class BookerEntity extends Entity<BookerProps> {
  protected readonly _id!: AggregateID;

  static async create(create: CreateBookerProps): Promise<BookerEntity> {
    const id = randomUUID();
    const props: BookerProps = {
      email: create.email,
    };
    const booker = new BookerEntity({ id, props });
    return booker;
  }

  // TODO : move to Authentication
  // private static async getHashedPassword(password: string): Promise<string> {
  //   return argon2.hash(password);
  // }

  // public async comparePassword(password: string): Promise<boolean> {
  //   return argon2.verify(this._props.hashedPassword, password);
  // }

  validate(): void {}

  get email(): string {
    return this._props.email;
  }
}
