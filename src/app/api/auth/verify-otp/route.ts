 import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createAccessToken, createRefreshToken } from '@/lib/auth';
import { serialize } from 'cookie';



export async function POST(request: Request) {

  try {
    const { username, verifyCode } = await request.json();
    const decodedUsername = decodeURIComponent(username);
   
    if (!decodedUsername || !verifyCode) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }
    
    const user = await prisma.user.findUnique({where :{
      username: decodedUsername
    }})

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: true, message: 'User already verified' },
        { status: 200 }
      );
    }

    if (user.verifyCode !== verifyCode) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    if (!user.verifyCodeExpiry || new Date() > user.verifyCodeExpiry) {
      return NextResponse.json(
        { success: false, message: 'OTP expired' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { username: decodedUsername },
      data: {
        isVerified: true,
        verifyCode: '',
        verifyCodeExpiry: new Date(0),
      },
      include: {
        profile: true,
        children: true,
      },
    });

    
    

   
    const accessToken = await createAccessToken({
      id: updatedUser.id.toString(),
      username: updatedUser.username,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified, // ✅ now it's TRUE
    });
    

    const refreshToken = await createRefreshToken(updatedUser.id.toString());


    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      },
    });

    const accessCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60, 
    });

    const refreshCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Verification successful',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
      }
    });
    

    response.headers.append('Set-Cookie', accessCookie);
    response.headers.append('Set-Cookie', refreshCookie);

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error in verification"
    }, { status: 500 });
  }
}