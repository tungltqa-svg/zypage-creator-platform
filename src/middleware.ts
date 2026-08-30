import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limit';

export function middleware(request: NextRequest) {
  // Chỉ áp dụng Rate Limit cho các API endpoints và Auth
  if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/login')) {
    // Lấy IP của Client
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Giới hạn: Tối đa 30 requests trong 10 giây cho mỗi IP
    const { success, remaining, reset } = rateLimiter(ip, 30, 10000);

    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Quá nhiều yêu cầu cùng lúc (Too Many Requests). Vui lòng thử lại sau vài giây để tránh spam.',
          retryAfter: reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(reset),
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', '30');
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/login'],
};
