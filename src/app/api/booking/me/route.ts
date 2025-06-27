import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";



export async function GET(req : NextRequest) {
    try {
        const token = req.cookies.get("accessToken")?.value

        if(!token){
            return NextResponse.json({
                success: false,
                message: "Please login to view your bookings",
            },{status: 401})
        }

        const user = await verifyJWT(token)
    
        if(!user || !user.id){
            return NextResponse.json({
                success: false,
                message: "Please login to view your bookings",
            },{status: 403})
        }

        const bookings = await prisma.booking.findMany({
            where: {
              userId: parseInt(user.id),
              status : "PAID",
            },
            select: {
              id: true,
              seminar: {
                select: {
                  id: true,
                  title: true,
                  date: true,
                  time: true,
                  location: true,
                },
              },
              tickets: {
                select: {
                  ticketCode: true,
                },
              },
              paymentMethod: true,
              createdAt: true,
              quantity: true,
              totalPrice: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          return NextResponse.json({
            success: true,
            message: "Bookings fetched successfully",
            bookings: bookings,
          },{status: 200})

    } catch (error) {
      console.error(error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
       
        },{status: 500})
    }
}