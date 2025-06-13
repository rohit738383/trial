import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parse } from 'cookie';

export async function POST(req: Request) {
  const cookies = parse(req.headers.get('cookie') || '');
  const refreshToken = cookies.refreshToken;

  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true }
    });
  }

  const expiredAccess = 'accessToken=; HttpOnly; Path=/; Max-Age=0;';
  const expiredRefresh = 'refreshToken=; HttpOnly; Path=/; Max-Age=0;';

  const res = NextResponse.json({ success: true, message: 'Logged out' });
  res.headers.append('Set-Cookie', expiredAccess);
  res.headers.append('Set-Cookie', expiredRefresh);
  return res;
}
