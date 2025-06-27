import { z } from "zod";

export const inquiryUpdateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]),
  // Optional fields that can be updated
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(1).optional(),
  inquiryType: z.enum([
    "General Information",
    "Seminar Booking",
    "Technical Support",
    "Payment Issues",
    "Partnership Opportunities",
    "Career Opportunities",
    "Feedback & Suggestions",
  ]).optional(),
  subject: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
});

export const inquiryStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]),
});

export type InquiryUpdateData = z.infer<typeof inquiryUpdateSchema>;
export type InquiryStatusUpdateData = z.infer<typeof inquiryStatusUpdateSchema>; 