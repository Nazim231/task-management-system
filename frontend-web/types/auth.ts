export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export interface TokenPair {
  refreshToken: string;
  accessToken: string;
}

export enum TokenType {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}
