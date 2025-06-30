import { verifyJWT } from "@/lib/auth";
import { NextRequest , NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest){
    try {
        const token = req.cookies.get("accessToken")?.value;

        if(!token){
            return NextResponse.json({
                success : false,
                message : "Unauthorised"
            }, {status : 401})
        }

        const user = await verifyJWT(token);

        if(!user || user.role !== "ADMIN"){
            return NextResponse.json({
                success : false,
                message : "Forbidden",
            },{status : 403})
        }

        // Get all users with their related data
        const users = await prisma.user.findMany({
            where: {
                role: "USER"
            },
            select: {
                id: true,
                fullName: true,
                phoneNumber: true,
                createdAt: true,
                profile: {
                    select: {
                        id: true,
                        address: true,
                        city: true,
                        state: true,
                        zipCode: true,
                        highestEducation: true,
                        relationToChild: true,
                        counterpartnerName: true,
                        counterpartnerPhoneNumber: true,
                        counterpartnerEducation: true,
                    }
                },
                children: {
                    select: {
                        id: true,
                        name: true,
                        age: true,
                        className: true,
                        gender: true,
                        createdAt: true
                    }
                },
                _count: {
                    select: {
                        bookings: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            message: "Users fetched successfully",
            data: users
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}