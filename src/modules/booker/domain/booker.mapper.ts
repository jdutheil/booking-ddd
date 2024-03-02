import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd/mapper.interface';
import {
  BookerModel,
  bookerSchema,
} from '../infrastructure/persistence/booker.model';
import { Booker } from './booker.entity';

@Injectable()
export class BookerMapper implements Mapper<Booker, BookerModel> {
  toDomain(record: BookerModel): Booker {
    return new Booker({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        email: record.email,
      },
    });
  }

  toPersistence(entity: Booker): BookerModel {
    const record: BookerModel = {
      id: entity.id,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    return bookerSchema.parse(record);
  }
}
