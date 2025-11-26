// Simple authentication utilities
import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'cfgl_auth';
const AUTH_COOKIE_VALUE = 'authenticated';

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  return authCookie?.value === AUTH_COOKIE_VALUE;
}

// Verify password against environment variable
export function verifyPassword(password: string): boolean {
  const correctPassword = process.env.LEAGUE_PASSWORD;
  if (!correctPassword) {
    console.error('LEAGUE_PASSWORD environment variable not set');
    return false;
  }
  return password === correctPassword;
}

// Cookie configuration
export const AUTH_COOKIE_CONFIG = {
  name: AUTH_COOKIE_NAME,
  value: AUTH_COOKIE_VALUE,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/',
};






