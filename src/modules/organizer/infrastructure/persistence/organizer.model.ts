import { z } from 'zod';

export const organizerSchema = z.object({
  id: z.string().uuid(),
  bookerId: z.string().uuid(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string().uuid(),
  contactIds: z.array(z.string().uuid()),
});

export type OrganizerModel = z.infer<typeof organizerSchema>;
