import { z } from 'zod';

export const authenticationSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  bookerId: z.string().uuid(),
});

export type AuthenticationModel = z.infer<typeof authenticationSchema>;
