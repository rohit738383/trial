import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { bookingId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!bookingId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing payment details",
        },
        { status: 400 }
      );
    }
    // Verify the payment signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    // Step 1: Fetch existing booking to get quantity
const existingBooking = await prisma.booking.findUnique({
  where: { id: bookingId },
  select: {
    quantity: true,
  },
});

if (!existingBooking) {
  throw new Error("Booking not found");
}


    const booking = await prisma.booking.update({
        where : {id : bookingId},
        data : {
            status : "PAID",
            razorpayPaymentId : razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            tickets: {
              create: Array.from({ length: existingBooking.quantity }, () => ({
                ticketCode: `TICKET-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
              })),
            }
            
          },
          include: { tickets: true },
    })

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify payment",
      },
      { status: 500 }
    );
  }
} 