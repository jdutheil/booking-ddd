import { Injectable } from '@nestjs/common';
import { EntityID } from '@src/libs/ddd';
import { None, Option, Some } from 'oxide.ts';
import { Contact } from '../../domain/contact.entity';
import { ContactRepository } from './contact.repository';

@Injectable()
export class ContactInMemoryRepository implements ContactRepository {
  contacts: Contact[] = [];

  async save(contact: Contact): Promise<void> {
    const existingContact = await this.findOneById(contact.id);
    if (existingContact.isSome()) {
      // Update
      const index = this.contacts.findIndex(
        (contact) => contact.id === existingContact.unwrap().id,
      );
      this.contacts[index] = contact;
    } else {
      // Insert
      this.contacts.push(contact);
    }
  }

  async findOneById(id: EntityID): Promise<Option<Contact>> {
    const contact = this.contacts.find((contact) => contact.id === id);
    if (!contact) {
      return None;
    }

    return Some(contact);
  }
}
