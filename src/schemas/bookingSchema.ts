import { z } from 'zod'

export const createBookingSchema = z.object({
  seminarId: z.string().uuid(),
  quantity: z.number().int().min(1),
})
