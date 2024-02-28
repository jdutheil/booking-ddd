import { EntityID } from '@src/libs/ddd';
import { Option } from 'oxide.ts';
import { Contact } from '../../domain/contact.entity';

export interface ContactRepository {
  save(contact: Contact): Promise<void>;
  findOneById(id: EntityID): Promise<Option<Contact>>;
}

export const CONTACT_REPOSITORY = Symbol('CONTACT_REPOSITORY');
