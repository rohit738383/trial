import {z} from 'zod'

export const seminarSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  time: z.string().min(3),
  duration: z.number().int().positive(),
  location: z.string().min(3),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  capacity: z.number().int().positive(),
  status: z.enum(['UPCOMING', 'COMPLETED', 'ONGOING']),
});
