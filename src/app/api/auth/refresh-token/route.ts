import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { createAccessToken, createRefreshToken } from '@/lib/auth';
import { serialize, parse } from 'cookie';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  console.log('[RefreshToken] Cookie header:', cookieHeader);
  const cookies = parse(cookieHeader);
  const refreshToken = cookies.refreshToken;
  console.log('[RefreshToken] Extracted refreshToken:', refreshToken ? 'exists' : 'missing');

  if (!refreshToken) {
    console.log('[RefreshToken] No refresh token found in cookies');
    return NextResponse.json({ success: false, message: 'No refresh token' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(refreshToken, JWT_SECRET);
    console.log('[RefreshToken] JWT verified, payload:', payload);
    const userId = parseInt(payload.userId as string);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      console.log('[RefreshToken] No stored token found for this refresh token');
      await prisma.refreshToken.updateMany({
        where: { userId },
        data: { revoked: true },
      });
      return NextResponse.json({ success: false, message: 'Token reuse detected' }, { status: 403 });
    }

    if (storedToken.revoked) {
      console.log('[RefreshToken] Stored token is revoked. Possible token reuse detected.');
      await prisma.refreshToken.updateMany({
        where: { userId },
        data: { revoked: true },
      });
      return NextResponse.json({ success: false, message: 'Token reuse detected' }, { status: 403 });
    }

    if (storedToken.expiresAt < new Date()) {
      console.log('[RefreshToken] Stored token expired at:', storedToken.expiresAt);
      return NextResponse.json({ success: false, message: 'Token expired' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.log('[RefreshToken] User not found with id:', userId);
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    console.log('[RefreshToken] Creating new refresh token for user:', user.id);
    const newRefreshToken = await createRefreshToken(user.id.toString());

    const newStoredToken = await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        parentTokenId: storedToken.id,
      },
    });
    console.log('[RefreshToken] Stored new refresh token with id:', newStoredToken.id);

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        revoked: true,
        replacedById: newStoredToken.id,
      },
    });
    console.log('[RefreshToken] Revoked old refresh token with id:', storedToken.id);

    const newAccessToken = await createAccessToken({
      id: user.id.toString(),
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
    });
    console.log('[RefreshToken] Created new access token');

    const accessCookie = serialize('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 15,
    });

    const refreshCookie = serialize('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    const response = new NextResponse(JSON.stringify({ success: true, message: 'Refreshed' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    response.headers.append('Set-Cookie', accessCookie);
    response.headers.append('Set-Cookie', refreshCookie);
    console.log('[RefreshToken] Set-Cookie headers appended for accessToken and refreshToken');

    return response;
  } catch (err) {
    console.error('[RefreshToken] Error during token verification:', err);
    return NextResponse.json({ success: false, message: 'Invalid refresh token' }, { status: 401 });
  }
}
