import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/schemas/bookingSchema";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to book a seminar",
        },
        { status: 401 }
      );
    }

    const user = await verifyJWT(token);

    if (!user || !user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.errors,
        },
        { status: 400 }
      );
    }

     const {seminarId , quantity} = parsed.data;

     if(!seminarId || !quantity || quantity <= 0){
         return NextResponse.json({
            success : false,    
            message : "Invalid Input"
         },
         {status : 400}
        )
     }

  const seminar = await prisma.seminar.findUnique({
     where : {id : seminarId}
  })

  if(!seminar){
     return NextResponse.json({
        success : false,
        message : "Seminar not found"
     },
     {status : 404}
    )
  }

  const booked = await prisma.booking.aggregate({
    where :{
        seminarId,
        status : "PAID"
    },
    _sum : { quantity : true }

  })

  const bookedcount = booked._sum.quantity ?? 0;
  const availableSeats = seminar.capacity - bookedcount;

  if(quantity > availableSeats){
      return NextResponse.json({
        success : false,
        message : `Only ${availableSeats} seats are available for this seminar`
      },
      {status : 400}
    )
  }

const totalPrice = seminar.price.mul(quantity);

const booking = await prisma.booking.create({
    data :{
        userId : Number(user.id),
        seminarId,
        quantity,
        totalPrice,
        status : "PENDING"
    }
})

const razorpayOrder = await razorpay.orders.create({
    amount : totalPrice.toNumber() * 100,
    currency : "INR",
    receipt : `booking-${booking.id}`,   //yha pa bhi aana ka chances hai
    notes : {
        seminarId,
        quantity,
    }
})

await prisma.booking.update({
    where : {id : booking.id},
    data : {
        razorpayOrderId : razorpayOrder.id,
        razorpayPaymentId : null,
    }
})

return NextResponse.json({
    success : true,
    orderId : razorpayOrder.id,
    bookingId : booking.id,
    amount : totalPrice.toNumber(),   //yha par error aa skhta hai
    currency : "INR",

})

   } catch (error) {
    console.error("Booking error", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
   }
}

