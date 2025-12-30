import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add pathname header for SSR theme determination
  const pathname = request.nextUrl.pathname;
  response.headers.set('x-pathname', pathname);

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
