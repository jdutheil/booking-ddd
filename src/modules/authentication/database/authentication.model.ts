import { z } from 'zod';

export const authenticationSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()),
  email: z.string().email(),
  password: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  bookerId: z.string().uuid(),
});

export type AuthenticationModel = z.infer<typeof authenticationSchema>;
