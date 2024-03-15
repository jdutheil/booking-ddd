import { EntityID } from '@src/libs/ddd';
import { Option } from 'oxide.ts';
import { Organizer } from '../../domain/organizer.entity';

export interface OrganizerRepository {
  save(organizer: Organizer): Promise<void>;
  idExists(id: EntityID): Promise<boolean>;
  findOneById(id: EntityID): Promise<Option<Organizer>>;
  findAllForBooker(bookerId: EntityID): Promise<Organizer[]>;
}

export const ORGANIZER_REPOSITORY = Symbol('ORGANIZER_REPOSITORY');
