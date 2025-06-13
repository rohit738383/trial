import {z} from 'zod'

export const seminarSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Invalid date',
      }),
      location: z.string().min(3),
});