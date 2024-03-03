import { EntityID } from '@src/libs/ddd';
import { Option } from 'oxide.ts';
import { Contact } from '../../domain/contact.entity';

export interface ContactRepository {
  save(contact: Contact): Promise<void>;
  idExists(id: EntityID): Promise<boolean>;
  emailExistsForBooker(email: string, bookerId: EntityID): Promise<boolean>;
  findOneById(id: EntityID): Promise<Option<Contact>>;
  findOneByEmailForBooker(
    email: string,
    bookerId: EntityID,
  ): Promise<Option<Contact>>;
}

export const CONTACT_REPOSITORY = Symbol('CONTACT_REPOSITORY');
