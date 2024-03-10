import { DomainEvent } from '@src/libs/ddd';
import { Organizer } from '../organizer.entity';

export class OrganizerCreatedEvent extends DomainEvent {
  constructor(public readonly organizer: Organizer) {
    super({ aggregateId: organizer.id });
  }
}
