import { Entity, EntityID } from '@libs/ddd';
import { randomUUID } from 'crypto';
import { BookerProps, CreateBookerProps } from './booker.types';

export class BookerEntity extends Entity<BookerProps> {
  protected readonly _id!: EntityID;

  static async create(create: CreateBookerProps): Promise<BookerEntity> {
    const id = randomUUID();
    const props: BookerProps = {
      email: create.email,
    };
    const booker = new BookerEntity({ id, props });
    return booker;
  }

  validate(): void {}

  get email(): string {
    return this._props.email;
  }
}
