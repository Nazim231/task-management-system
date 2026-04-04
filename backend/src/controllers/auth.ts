import type { Request, Response } from 'express';
import type { UserRegistration } from '../types/user';
import type { ApiResponse } from '../types/api';
import { validateUserData } from '../lib/validator';
import { requestFailed, requestCompleted } from '../lib/apiResponse';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

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
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return requestFailed(res, 409, 'User already exists', {
          email: 'Email is already registered',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
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

      return requestCompleted(res, 'User Registered Successfully', { user });
    } catch (error) {
      console.error('Registration error:', error);
      return requestFailed(res, 500, 'Internal server error');
    }
  }

  login(req: Request, res: Response) {}

  refresh(req: Request, res: Response) {}

  logout(req: Request, res: Response) {}
}

export const auth = new AuthController();
