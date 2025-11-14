import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/store/authStore';
import { AuthResponse, LoginCredentials } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      const response: AuthResponse = {
        success: false,
        error: 'Email and password are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const user = authenticateUser(email, password);

    if (!user) {
      const response: AuthResponse = {
        success: false,
        error: 'Invalid email or password',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const response: AuthResponse = {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: AuthResponse = {
      success: false,
      error: 'Login failed',
    };
    return NextResponse.json(response, { status: 500 });
  }
}