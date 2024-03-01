import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { EntityID } from '@src/libs/ddd';
import { Option } from 'oxide.ts';
import { Contact } from '../../domain/contact.entity';
import { ContactError } from '../../domain/contact.errors';
import { ContactMapper } from '../../domain/contact.mapper';
import { ContactRepository } from './contact.repository';

@Injectable()
export class ContactPrismaRepository implements ContactRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ContactMapper,
  ) {}

  async save(contact: Contact): Promise<void> {
    const record = this.mapper.toPersistence(contact);
    try {
      const contactExists = await this.idExists(contact.id);
      if (contactExists) {
        await this.prisma.contact.update({
          where: { id: contact.id },
          data: record,
        });
      } else {
        await this.prisma.contact.create({ data: record });
      }
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ContactError('Contact already exists');
      }

      throw new ContactError('Error saving contact', error);
    }
  }

  async idExists(id: EntityID): Promise<boolean> {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    return contact !== null;
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
