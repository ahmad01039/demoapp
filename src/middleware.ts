import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('__Secure-next-auth.session-token');
  const { pathname } = req.nextUrl;
console.log("path name getting invoked");
  console.log(pathname);
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  if (['/login', '/signup'].includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup', '/dashboard'], 
};
