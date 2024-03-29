import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { Option } from 'oxide.ts';
import { Organizer, OrganizerType } from '../../domain/organizer.entity';
import { OrganizerError } from '../../domain/organizer.errors';
import { OrganizerMapper } from '../../domain/organizer.mapper';
import { OrganizerRepository } from './organizer.repository';

@Injectable()
export class OrganizerPrismaRepository implements OrganizerRepository {
  private logger: Logger = new Logger(OrganizerPrismaRepository.name);

  constructor(
    private prisma: PrismaService,
    private mapper: OrganizerMapper,
  ) {}

  async save(organizer: Organizer): Promise<void> {
    const record = this.mapper.toPersistence(organizer);
    try {
      const organizerExists = await this.idExists(organizer.id);
      if (organizerExists) {
        // Remove emails / phones to recreate them
        // TODO : find a more optimized way ?
        const removeExistingEmails = this.prisma.organizerEmail.deleteMany({
          where: { organizerId: organizer.id },
        });
        const removeExistingPhones = this.prisma.organizerPhone.deleteMany({
          where: { organizerId: organizer.id },
        });

        const update = this.prisma.organizer.update({
          where: { id: organizer.id },
          data: {
            ...record,
            emails: {
              create: organizer.emails.map((email) => ({ value: email.value })),
            },
            phones: {
              create: organizer.phones.map((phone) => ({ value: phone })),
            },
            contacts: {
              connect: organizer.contactIds.map((id) => ({ id })),
            },
          },
        });

        await this.prisma.$transaction([
          removeExistingEmails,
          removeExistingPhones,
          update,
        ]);
      } else {
        await this.prisma.organizer.create({
          data: {
            ...record,
            emails: {
              create: organizer.emails.map((email) => ({ value: email.value })),
            },
            phones: {
              create: organizer.phones.map((phone) => ({ value: phone })),
            },
            contacts: {
              connect: organizer.contactIds.map((id) => ({ id })),
            },
          },
        });
      }
    } catch (error: unknown) {
      this.logger.error('Unkown error saving organizer', error);
      throw new OrganizerError('Error saving organizer', error);
    }
  }

  async idExists(id: string): Promise<boolean> {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id },
    });

    return organizer !== null;
  }

  async findAllForBooker(bookerId: string): Promise<Organizer[]> {
    const organizers = await this.prisma.organizer.findMany({
      where: { bookerId },
      include: {
        emails: true,
        phones: true,
        contacts: true,
      },
    });

    return organizers.map((organizer) =>
      this.mapper.toDomain({
        ...organizer,
        type: organizer.type as OrganizerType,
      }),
    );
  }

  async findOneById(id: string): Promise<Option<Organizer>> {
    const organizerRecord = await this.prisma.organizer.findUnique({
      where: { id },
      include: { contacts: true },
    });

    return Option.from(organizerRecord).map((record) =>
      this.mapper.toDomain({
        ...record,
        type: record.type as OrganizerType,
      }),
    );
  }
}
