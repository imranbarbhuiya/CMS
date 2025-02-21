import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const cookie = request.cookies.get('token')?.value;
	const path = request.nextUrl.pathname;

	if (path === '/' && cookie) return NextResponse.redirect(new URL('/dashboard/leads', request.url));
	if (path === '/' && !cookie) return NextResponse.redirect(new URL('/login', request.url));

	if (path.startsWith('/dashboard') && !cookie) return NextResponse.redirect(new URL('/login', request.url));

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
