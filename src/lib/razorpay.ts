// lib/razorpay.ts
import axios from "axios";
import Razorpay from "razorpay";
import { toast } from "sonner";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});



