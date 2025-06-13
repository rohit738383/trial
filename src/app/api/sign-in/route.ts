import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { createAccessToken, createRefreshToken } from '@/lib/auth';
import { signInSchema } from "@/schemas/signInSchema";
import {calculateProfileCompletion} from "@/lib/profile";
import { generateRandomAvatar } from '@/lib/avatar';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid Input",
        errors: parsed.error.errors,
      }, { status: 400 });
    }

    const { identifier, password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier.toLowerCase() },
          { phoneNumber: identifier },
        ]
      },
      include: {
        profile: true,
        children: true,
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User does not exist"
      }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({
        success: false,
        message: "Password is incorrect"
      }, { status: 404 });
    }

    if (!user.isVerified) {
      return NextResponse.json({
        success: false,
        message: "Account not verified. Please sign-up again.",
      }, { status: 403 });
    }
    

    const accessToken = await createAccessToken({
      id: user.id.toString(),
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
    });

    const refreshToken = await createRefreshToken(user.id.toString());

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    const accessCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    const refreshCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    const avatar = generateRandomAvatar(user.username); 
    const { percentage, missingFields } = calculateProfileCompletion(user.profile, user.children);




    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
        avatar,
        profileCompletion: {
          percentage: percentage,
          missingFields,
        },
      }
    });

    response.headers.append('Set-Cookie', accessCookie);
    response.headers.append('Set-Cookie', refreshCookie);

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error in login"
    }, { status: 500 });
  }
}
