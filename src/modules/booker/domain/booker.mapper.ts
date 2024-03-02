import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd/mapper.interface';
import { ContactError } from '@src/modules/contact/domain/contact.errors';
import {
  BookerModel,
  bookerSchema,
} from '../infrastructure/persistence/booker.model';
import { Booker } from './booker.entity';
import { BookerEmail } from './value-objects/booker-email';

@Injectable()
export class BookerMapper implements Mapper<Booker, BookerModel> {
  toDomain(record: BookerModel): Booker {
    const result = Booker.create(
      {
        email: BookerEmail.create(record.email).unwrap(),
      },
      record.id,
    );

    if (result.isErr()) {
      throw new ContactError(
        'An error occured during Contact mapping',
        result.unwrapErr(),
      );
    }

    return result.unwrap();
  }

  toPersistence(entity: Booker): BookerModel {
    const record: BookerModel = {
      id: entity.id,
      email: entity.email.value,
    };

    return bookerSchema.parse(record);
  }
}
