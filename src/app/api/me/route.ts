import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateProfileCompletion } from "@/lib/profile";
import { generateRandomAvatar } from "@/lib/avatar";
import { User, UserProfile, Child } from "@prisma/client";

type UserWithProfileAndChildren = User & {
  profile: UserProfile | null;
  children: Child[];
};

function getProfileData(user: UserWithProfileAndChildren) {
  return {
    avatar: generateRandomAvatar(user.username),
    profileCompletion: calculateProfileCompletion(user.profile, user.children || []),
  };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    console.log("refreshToken",refreshToken);

    if (!refreshToken) {
      console.log("No refresh token found",refreshToken);
      return NextResponse.json({ user: null }, { status: 404 });
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload || !payload.userId) {
      return NextResponse.json({ user: null }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      include: { profile: true, children: true },
    });

    if (!user) return NextResponse.json({ user: null }, { status: 404 });

    const { avatar, profileCompletion } = getProfileData(user);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar,
        profileCompletion,
        children: user.children || [],
      },
    });
  } catch (err) {
    console.error("API /me error:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
