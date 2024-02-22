import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd/mapper.interface';
import { BookerModel, bookerSchema } from '../database/booker.model';
import { BookerEntity } from './booker.entity';

@Injectable()
export class BookerMapper implements Mapper<BookerEntity, BookerModel> {
  toDomain(record: BookerModel): BookerEntity {
    return new BookerEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        email: record.email,
      },
    });
  }

  toPersistence(entity: BookerEntity): BookerModel {
    const record: BookerModel = {
      id: entity.id,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    return bookerSchema.parse(record);
  }
}
