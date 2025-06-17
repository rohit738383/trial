import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function GET(req : NextRequest) {
    try {
        const token = req.cookies.get("refreshToken")?.value

        if(!token){
            return NextResponse.json({
                success: false,
                message: "Please login to view your bookings",
            },{status: 401})
        }

        const user = await verifyRefreshToken(token)
    
        if(!user || !user.userId){
            return NextResponse.json({
                success: false,
                message: "Please login to view your bookings",
            },{status: 401})
        }

        const bookings = await prisma.booking.findMany({
            where: {
              userId: parseInt(user.userId),
            },
            include: {
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
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        },{status: 500})
    }
}