import { z } from "zod";

export const inquirySchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  inquiryType: z.enum([
    "General Information",
    "Seminar Booking",
    "Technical Support",
    "Payment Issues",
    "Partnership Opportunities",
    "Career Opportunities",
    "Feedback & Suggestions",
  ]),
  subject: z.string().min(1),
  message: z.string().min(1),
  status: z.enum(["PENDING" , "IN_PROGRESS" , "RESOLVED"]), // 👈 added
  createdAt: z.string(), // 👈 must add this if your backend sends it
});