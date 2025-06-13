import { adminLoginSchema } from '@/schemas/adminLoginSchema';
import { prisma } from '@/lib/prisma';
import {NextResponse} from 'next/server';
import { createAccessToken, createRefreshToken } from '@/lib/auth';
import { serialize } from 'cookie';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return  NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
    }

    const { identifier, password } = parsed.data;

    const admin = await prisma.user.findUnique({ where: { username: identifier.toLowerCase() } });

    if (!admin) {
      return NextResponse.json({  success: false, message: "Admin Not Exist.", }, { status: 404 });
    }

    if (admin.password !== password) {
      return  NextResponse.json({success: false, message: 'Incorrect password' }, { status: 403 });
    }

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized Access' }, { status: 404 });
    }

      const  accessToken = await createAccessToken({
            id: admin.id.toString(),
            username: admin.username,
            role: admin.role,
            isVerified: admin.isVerified,
          });
    
     const refreshToken = await createRefreshToken(admin.id.toString());

     await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: admin.id,
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
      message: 'Login successful',
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        isVerified: admin.isVerified,
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
    

