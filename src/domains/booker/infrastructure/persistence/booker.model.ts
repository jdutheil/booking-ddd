import { z } from 'zod';

export const bookerSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

export type BookerModel = z.infer<typeof bookerSchema>;
