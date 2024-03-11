import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@src/infrastructure/prisma/prisma.service';
import { Option } from 'oxide.ts';
import { Organizer } from '../../domain/organizer.entity';
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
        await this.prisma.organizer.update({
          where: { id: organizer.id },
          data: {
            ...record,
            contacts: {
              connect: organizer.contactIds.map((id) => ({ id })),
            },
          },
        });
      } else {
        await this.prisma.organizer.create({
          data: {
            ...record,
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
    });

    return organizers.map((organizer) => this.mapper.toDomain(organizer));
  }

  async findOneById(id: string): Promise<Option<Organizer>> {
    const organizerRecord = await this.prisma.organizer.findUnique({
      where: { id },
      include: { contacts: true },
    });

    return Option.from(organizerRecord).map(this.mapper.toDomain);
  }
}
