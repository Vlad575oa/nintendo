import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/adminSession';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const withSecurityHeaders = (response: NextResponse) => {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    return response;
  };

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const session = await verifyAdminSession(token);
    if (!session && pathname !== '/admin/login') {
      return withSecurityHeaders(NextResponse.redirect(new URL('/admin/login', request.url)));
    }
  }

  // Protect /api/admin routes (except the login endpoint itself)
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const session = await verifyAdminSession(token);
    if (!session) {
      return withSecurityHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }
  }

  // Protect /account routes — server-side redirect to login
  if (pathname.startsWith('/account')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      return withSecurityHeaders(NextResponse.redirect(new URL('/auth/login?next=' + encodeURIComponent(pathname), request.url)));
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/account/:path*'],
};
