import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { EntityID } from '@src/libs/ddd';
import { Option } from 'oxide.ts';
import { Contact } from '../../domain/contact.entity';
import { ContactRepository } from './contact.repository';

@Injectable()
export class ContactPrismaRepository implements ContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(contact: Contact): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async idExists(id: EntityID): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async emailExistsForBooker(
    email: string,
    bookerId: EntityID,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async findOneById(id: EntityID): Promise<Option<Contact>> {
    throw new Error('Method not implemented.');
  }

  async findOneByEmailForBooker(
    email: string,
    bookerId: EntityID,
  ): Promise<Option<Contact>> {
    throw new Error('Method not implemented.');
  }
}
