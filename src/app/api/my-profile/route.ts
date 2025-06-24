import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRefreshToken } from "@/lib/auth";

export async function GET(request : NextRequest){

    try {
        const token = request.cookies.get("refreshToken")?.value

        if(!token){
            return NextResponse.json({
                success : false,
                message : "unauthorized"
            },{status : 401})
        }

        const user = await verifyRefreshToken(token);

        if(!user?.userId){
           return NextResponse.json({
            success : false,
            message : "Not found"
           },{status : 403})
        }

        const userId = Number(user.userId);


    const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          phoneNumber: true,
          email: true,
          fullName: true,
          profile: true,     // UserProfile
          children: true,    // Child[]
        },
      });

      if (!userData) {
        return NextResponse.json({ success : false , message: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json(userData);

    } catch (error) {
        console.error("MY-PROFILE GET ERROR:", error);
        return NextResponse.json({ success : false , message: "Something went wrong" }, { status: 500 });
    }

}