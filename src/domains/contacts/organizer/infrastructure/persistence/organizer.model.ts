import { contactSchema } from '@src/domains/contacts/contact/infrastructure/persistence/contact.model';
import { z } from 'zod';
import { OrganizerType } from '../../domain/organizer.entity';

const emailSchema = z.object({
  value: z.string().email(),
});
const phoneSchema = z.object({
  value: z.string(),
});

export const organizerSchema = z.object({
  id: z.string().uuid(),
  bookerId: z.string().uuid(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  type: z.nativeEnum(OrganizerType),
  emails: z.array(emailSchema).optional(),
  phones: z.array(phoneSchema).optional(),
  contacts: z.array(contactSchema).optional(),
});

export type OrganizerModel = z.infer<typeof organizerSchema>;
