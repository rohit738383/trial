import { jwtVerify, SignJWT, type JWTPayload as JoseJWTPayload } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET!;
const secretKey = new TextEncoder().encode(JWT_SECRET);

export type JWTPayload = {
  id: string;
  username: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
} & JoseJWTPayload;

export async function createAccessToken(user: {
  id: string;
  username: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
}): Promise<string> {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secretKey);
}

export async function createRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload && payload.id && payload.role && payload.isVerified !== undefined) {
      return payload as JWTPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload && payload.userId) {
      return { userId: payload.userId as string };
    }
    return null;
  } catch {
    return null;
  }
}
