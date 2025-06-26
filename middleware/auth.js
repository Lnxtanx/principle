import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// List of public paths that don't require authentication
const publicPaths = ['/login', '/api/auth/login'];

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Allow access to public paths without token
  if (publicPaths.includes(path)) {
    // If user is logged in and tries to access login page, redirect to dashboard
    if (path === '/login' && token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        // If token is invalid, continue to login page
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Check for token on protected routes
  if (!token) {
    // Store the original URL to redirect back after login
    const searchParams = new URLSearchParams();
    if (path !== '/') {
      searchParams.set('returnUrl', path);
    }
    const loginUrl = `/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For any other path, verify the token
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      // If token is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};
