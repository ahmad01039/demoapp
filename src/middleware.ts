import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('next-auth.session-token'); 
 
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url)); 
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'], 
};
