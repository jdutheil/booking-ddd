import { DomainEvent } from '@src/libs/ddd';
import { Contact } from '../contact.entity';

export class ContactCreatedEvent extends DomainEvent {
  constructor(public readonly contact: Contact) {
    super({ aggregateId: contact.id });
  }
}
