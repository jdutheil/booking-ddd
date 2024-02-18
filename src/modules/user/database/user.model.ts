import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()),
  email: z.string().email(),
  hashedPassword: z.string(),
});

export type UserModel = z.infer<typeof userSchema>;
