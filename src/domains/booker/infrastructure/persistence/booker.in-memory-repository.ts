import { Injectable } from '@nestjs/common';
import { Booker } from '../../domain/booker.entity';
import { BookerAlreadyExistsError } from '../../domain/booker.errors';

@Injectable()
export class BookerInMemoryRepository {
  bookers: Booker[] = [];

  async register(entity: Booker): Promise<void> {
    const foundEntity = this.bookers.find(
      (booker) => booker.id === entity.id || booker.email === entity.email,
    );
    if (foundEntity) {
      throw new BookerAlreadyExistsError();
    }

    this.bookers.push(entity);
  }
}
