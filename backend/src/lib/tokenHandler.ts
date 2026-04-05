import { User } from '../generated/prisma/client';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { RefreshTokenPayload, TokenPair } from '../types/user';
import { prisma } from './prisma';
import { v4 as geneateId } from 'uuid';
import bcrypt from 'bcryptjs';

// JWT signing secret key
const SECRET_KEY = process.env.SECRET_KEY ?? 'AsA8OiUx9F6oF4F7S6P';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function generateAccessToken(
  payload: Omit<User, 'updatedAt' | 'password'>,
): string {
  const token = sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRY });
  return token;
}

async function generateRefreshToken(
  userId: string,
  sessionId?: string,
): Promise<string> {
  const newSessionId = geneateId();
  const payload: RefreshTokenPayload = { userId, sessionId: newSessionId };
  const token = sign(payload, SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  if (sessionId) {
    // Session ID exists, then it's a rotational token
    // So, revoke the previous token
    await revokeToken(sessionId);
  }

  const refreshTokenHash = await bcrypt.hash(token, 10);

  // inserting new token or creating session
  await prisma.refreshSession.create({
    data: {
      userId,
      sessionId: newSessionId,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  });

  return token;
}

async function generateTokens(
  payload: Omit<User, 'updatedAt' | 'password'>,
  sessionId?: string,
): Promise<TokenPair> {
  const accessToken = generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload.id, sessionId);
  return { accessToken, refreshToken };
}

function verifyAccessToken(token: string): User | null {
  try {
    const user = verify(token, SECRET_KEY) as JwtPayload;

    // Ensure the decoded token has required user fields
    if (!user.id || !user.email) return null;

    return user as User;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

async function verifyRefreshToken(
  token: string,
): Promise<RefreshTokenPayload | null> {
  try {
    const tokenData = verify(token, SECRET_KEY) as RefreshTokenPayload;

    const session = await prisma.refreshSession.findUnique({
      where: {
        sessionId: tokenData.sessionId,
      },
    });

    if (!session || session.revoked || session.expiresAt < new Date()) {
      // if token is revoked or expired then it becomes invalid
      return null;
    }

    const matches = await bcrypt.compare(token, session.tokenHash);

    if (!matches) {
      return null;
    }

    return tokenData;
  } catch {
    return null;
  }
}

async function revokeToken(sessionId: string) {
  await prisma.refreshSession.update({
    where: { sessionId },
    data: { revoked: true },
  });
}

export {
  generateTokens,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  revokeToken,
};
