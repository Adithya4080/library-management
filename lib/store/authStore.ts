// lib/store/authStore.ts

import { IAuthUser } from '@/types/auth';

// In-memory user database (in production, use a real database)
const users: IAuthUser[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@library.com',
    password: 'admin123', // In production, hash passwords
    role: 'admin',
  },
  {
    id: 'user1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    id: 'user2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    id: 'user3',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    password: 'user123',
    role: 'user',
  },
];

export function findUserByEmail(email: string): IAuthUser | undefined {
  return users.find(u => u.email === email);
}

export function authenticateUser(email: string, password: string): IAuthUser | null {
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
}

export function getAllAuthUsers(): IAuthUser[] {
  return users;
}