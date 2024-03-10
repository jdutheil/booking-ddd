import { Injectable } from '@nestjs/common';
import { None, Option, Some } from 'oxide.ts';
import { Organizer } from '../../domain/organizer.entity';
import { OrganizerRepository } from './organizer.repository';

@Injectable()
export class OrganizerInMemoryRepository implements OrganizerRepository {
  organizers: Organizer[] = [];

  async save(organizer: Organizer): Promise<void> {
    const existingOrganizer = await this.findOneById(organizer.id);
    if (existingOrganizer.isSome()) {
      // Update
      const index = this.organizers.findIndex(
        (organizer) => organizer.id === existingOrganizer.unwrap().id,
      );
      this.organizers[index] = organizer;
    } else {
      // Insert
      this.organizers.push(organizer);
    }
  }

  async findAllForBooker(bookerId: string): Promise<Organizer[]> {
    return this.organizers.filter(
      (organizer) => organizer.bookerId === bookerId,
    );
  }

  async findOneById(id: string): Promise<Option<Organizer>> {
    const organizer = this.organizers.find((organizer) => organizer.id === id);
    if (!organizer) {
      return None;
    }

    return Some(organizer);
  }
}
