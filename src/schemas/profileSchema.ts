import { z } from 'zod';

export const userProfileSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  highestEducation: z.string().optional(),
  areaOfInterest: z.string().optional(),
  relationToChild: z.string().optional(),
  children: z
    .array(
      z.object({
        name: z.string(),
        age: z.number().min(0),
        gender: z.enum(['MALE', 'FEMALE']),
        className: z.string(),
      })
    )
    .optional(),
});
