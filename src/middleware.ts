import { NextResponse, NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    const refreshUrl = new URL('/silent-refresh', request.url);
    refreshUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(refreshUrl);
  }

  try {
    const user = await verifyJWT(token);

    if (!user) {
      throw new Error("Invalid token");
    }

    if (!user.isVerified) {
      return NextResponse.redirect(new URL('/not-verified', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/admin') && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/services') && user.role !== 'USER') {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    return NextResponse.next();
  } catch {
    const refreshUrl = new URL('/silent-refresh', request.url);
    refreshUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(refreshUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/services/:path*'],
};

