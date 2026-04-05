import { User } from "../generated/prisma/client";

export interface UserProfile {
  name: string;
}

export type PartialUser = Omit<User, 'password' | 'updatedAt'>;

export interface Credentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserProfile, Credentials {}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}