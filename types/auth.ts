// types/auth.ts

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password: string; // In production, this would be hashed
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
  error?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}