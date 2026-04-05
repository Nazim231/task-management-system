import type { Request, Response } from 'express';
import type { UserRegistration, Credentials, PartialUser } from '../types/user';
import type { ApiResponse } from '../types/api';
import { validateCredentials, validateUserData } from '../lib/validator';
import { requestFailed, requestCompleted } from '../lib/apiResponse';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import {
  generateTokens,
  revokeToken,
  verifyRefreshToken,
} from '../lib/tokenHandler';
import { Constants } from '../lib/constants';
import { User } from '../generated/prisma/client';

class AuthController {
  async register(
    req: Request<any, ApiResponse, UserRegistration>,
    res: Response<ApiResponse>,
  ) {
    // Validate credentials
    const validation = validateUserData(req.body);
    if (!validation.valid) {
      return requestFailed(res, 400, 'Validation Failed', validation.errors);
    }

    const { email, password, name } = req.body;

    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(email);

      if (existingUser) {
        return requestFailed(res, 409, 'User already exists', {
          email: 'Email is already registered',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user: PartialUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      // Token generation and adding in client cookies
      await this.generateAndAssignTokens(res, user);

      return requestCompleted(res, 'User Registered Successfully', { user });
    } catch (error) {
      console.error('Registration error:', error);
      return requestFailed(res, 500, 'Internal server error');
    }
  }

  async login(req: Request<any, ApiResponse, Credentials>, res: Response) {
    const { email, password } = req.body;

    const validation = validateCredentials(email, password);
    if (!validation.valid) {
      return requestFailed(res, 400, 'Invalid Credentials', validation.errors);
    }

    const user = await this.getUserByEmail(email);

    if (!user) return requestFailed(res, 404, 'No user found');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return requestFailed(res, 400, 'Invalid Credentials', {
        password: 'Invalid Password',
      });
    }

    const { password: psk, updatedAt, ...partialUser } = user;

    await this.generateAndAssignTokens(res, partialUser as PartialUser);

    return requestCompleted(res, 'Login success');
  }

  async refresh(req: Request, res: Response) {
    try {
      // Get refresh token from cookies or authorization header
      const refreshToken =
        req.cookies?.[Constants.REFRESH_TOKEN] ||
        req.headers.authorization?.split(' ')[1];

      if (!refreshToken) {
        return requestFailed(res, 401, 'Refresh token required');
      }

      // Verify the refresh token
      const sessionData = await verifyRefreshToken(refreshToken);
      if (!sessionData) {
        return requestFailed(res, 401, 'Invalid or expired refresh token');
      }

      const user = await this.getUserById(sessionData.userId);

      if (!user) {
        return requestFailed(res, 401, 'Invalid refresh token');
      }

      const {password, updatedAt, ...partialUser} = user;

      // Generate new tokens
      await this.generateAndAssignTokens(res, partialUser, sessionData.sessionId);

      return requestCompleted(res, 'Token refreshed successfully');
    } catch (error) {
      console.error('Token refresh error:', error);
      return requestFailed(res, 500, 'Internal server error');
    }
  }

  async logout(req: Request, res: Response) {
    const refreshToken =
      req.cookies?.[Constants.REFRESH_TOKEN] ||
      req.headers.authorization?.split(' ')[1];

    const tokenData = await verifyRefreshToken(refreshToken);

    if (tokenData) revokeToken(tokenData.sessionId);

    res.clearCookie(Constants.ACCESS_TOKEN);
    res.clearCookie(Constants.REFRESH_TOKEN);

    return requestCompleted(res, 'Logged out successfully');
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) return null;

    return (await prisma.user.findUnique({ where: { email } })) as User;
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id) return null;

    return (await prisma.user.findUnique({ where: { id } })) as User;
  }

  async generateAndAssignTokens(res: Response, user: PartialUser, sessionId?: string) {
    const tokens = await generateTokens(user);

    res.cookie(Constants.ACCESS_TOKEN, tokens.accessToken);
    res.cookie(Constants.REFRESH_TOKEN, tokens.refreshToken);

    return tokens;
  }
}

export const auth = new AuthController();
