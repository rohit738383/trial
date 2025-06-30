import { NextRequest, NextResponse } from "next/server"
import { verifyJWT } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { userProfileSchema } from "@/schemas/profileSchema"
import { calculateProfileCompletion } from "@/lib/profile"
import { generateRandomAvatar } from "@/lib/avatar"

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get("cookie")?.split("accessToken=")[1]?.split(";")[0]
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await verifyJWT(token)
    if (!user || !user.id) return NextResponse.json({ success: false, message: "Unauthorized Access" }, { status: 404 })

    const userId = Number(user.id)
    const body = await req.json()

    const parsed = userProfileSchema.parse(body)
    const { children, ...profileData } = parsed

    // Upsert profile
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: { ...profileData },
      create: { userId, ...profileData },
    })

    // Refresh children
    await prisma.child.deleteMany({ where: { userId } })

    if (children && children.length > 0) {
      await prisma.child.createMany({
        data: children.map((child) => ({ ...child, userId })),
      })
    }

    const latestChildren = await prisma.child.findMany({ where: { userId } })

    const profileCompletion = calculateProfileCompletion(updatedProfile, latestChildren)

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
      },
    })
    
    if (!dbUser) return NextResponse.json({ success: false,message: "User not found" }, { status: 404 })
    
    return NextResponse.json({
      user: {
        ...dbUser,
        avatar: generateRandomAvatar(dbUser.username),
        profileCompletion,
        children: latestChildren,
      },
      success: true,
      message: "Profile updated successfully",
    },{status: 200})
    
    

    
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, message: "Invalid input or server error" }, { status: 500 })
  }
}

  

  export async function GET(req: NextRequest) {
    try {
      const token = req.headers.get("cookie")?.split("accessToken=")[1]?.split(";")[0];
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const user = await verifyJWT(token);
      if (!user || !user.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 404 });
  
      const userId = Number(user.id);
  
      const profile = await prisma.userProfile.findUnique({ where: { userId } });
      const children = await prisma.child.findMany({ where: { userId } });
      const completionData = calculateProfileCompletion(profile, children);
  
      return NextResponse.json({ 
        profile, 
        children,
        profileCompletion: completionData // Now returns object
      },{status : 200});
    } catch (error) {
      console.error("GET profile error:", error);
      return NextResponse.json({ success: false, message: "Failed to fetch profile" }, { status: 500 });
    }
  }

