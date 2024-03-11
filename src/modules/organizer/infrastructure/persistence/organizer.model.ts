import { contactSchema } from '@src/modules/contact/infrastructure/persistence/contact.model';
import { z } from 'zod';

export const organizerSchema = z.object({
  id: z.string().uuid(),
  bookerId: z.string().uuid(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  contacts: z.array(contactSchema).optional(),
});

export type OrganizerModel = z.infer<typeof organizerSchema>;
