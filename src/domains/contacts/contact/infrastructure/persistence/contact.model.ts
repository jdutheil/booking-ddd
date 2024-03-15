import { z } from 'zod';

export const contactSchema = z.object({
  id: z.string().uuid(),
  bookerId: z.string().uuid(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
});

export type ContactModel = z.infer<typeof contactSchema>;
