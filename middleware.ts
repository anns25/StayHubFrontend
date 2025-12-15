import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Protect hotel owner dashboard
  if (pathname.startsWith('/hotel-owner/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // You could also check localStorage here, but cookies are better for SSR
    // For now, we'll handle this client-side
  }

  // Protect admin dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/hotel-owner/dashboard/:path*', '/admin/dashboard/:path*'],
};