import { z } from 'zod'

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(2, { message: 'Identifier is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});
