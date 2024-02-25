import { BookerEntity } from '../../domain/booker.entity';

export interface BookerRepositoryPort {
  register(booker: BookerEntity): Promise<void>;
}

export const BOOKER_REPOSITORY = Symbol('BOOKER_REPOSITORY');
