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



export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("refreshToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const user = await verifyRefreshToken(token);

    if (!user?.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid user" },
        { status: 403 }
      );
    }

    const userId = Number(user.userId);
    const body = await request.json();

    const { phoneNumber, address, city, state, zipcode } = body;

    // Check: at least one field provided
    if (!phoneNumber && !address && !city && !state && !zipcode) {
      return NextResponse.json(
        { success: false, message: "No fields provided" },
        { status: 400 }
      );
    }

    // Update phoneNumber in User table if provided
    if (phoneNumber) {
      await prisma.user.update({
        where: { id: userId },
        data: { phoneNumber },
      });
    }

    // Check if profile exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    const profileDataToUpdate: any = {};
    if (address) profileDataToUpdate.address = address;
    if (city) profileDataToUpdate.city = city;
    if (state) profileDataToUpdate.state = state;
    if (zipcode) profileDataToUpdate.zipCode = zipcode;

    if (Object.keys(profileDataToUpdate).length > 0) {
      if (existingProfile) {
        await prisma.userProfile.update({
          where: { userId },
          data: profileDataToUpdate,
        });
      } else {
        await prisma.userProfile.create({
          data: {
            userId,
            ...profileDataToUpdate,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/my-profile error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
