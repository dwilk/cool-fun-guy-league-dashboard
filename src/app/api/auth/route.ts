import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, AUTH_COOKIE_CONFIG } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create response with auth cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE_CONFIG);

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  // Logout - clear the auth cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete(AUTH_COOKIE_CONFIG.name);
  return response;
}






