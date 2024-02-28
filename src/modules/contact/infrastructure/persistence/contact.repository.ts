import { EntityID } from '@src/libs/ddd';
import { Option } from 'oxide.ts';
import { Contact } from '../../domain/contact.entity';

export interface ContactRepository {
  save(contact: Contact): Promise<void>;
  idExists(id: EntityID): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
  findOneById(id: EntityID): Promise<Option<Contact>>;
  findOneByEmail(email: string): Promise<Option<Contact>>;
}

export const CONTACT_REPOSITORY = Symbol('CONTACT_REPOSITORY');
