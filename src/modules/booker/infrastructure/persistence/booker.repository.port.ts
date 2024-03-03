import { Booker } from '../../domain/booker.entity';

export interface BookerRepositoryPort {
  register(booker: Booker): Promise<void>;
}

export const BOOKER_REPOSITORY = Symbol('BOOKER_REPOSITORY');
