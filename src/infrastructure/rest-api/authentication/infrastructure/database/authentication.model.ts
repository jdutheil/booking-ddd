import { z } from 'zod';

export const authenticationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  bookerId: z.string().uuid(),
});

export type AuthenticationModel = z.infer<typeof authenticationSchema>;
