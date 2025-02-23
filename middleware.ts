import { NextResponse } from 'next/server';

import { Api } from './lib/fetch';

import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const cookie = request.cookies.get('token')?.value;
	const path = request.nextUrl.pathname;

	if (path === '/' && cookie) return NextResponse.redirect(new URL('/dashboard/leads', request.url));
	if (path === '/' && !cookie) return NextResponse.redirect(new URL('/login', request.url));

	if (path.startsWith('/dashboard')) {
		if (!cookie) return NextResponse.redirect(new URL('/login', request.url));

		const { error } = await Api.GET('/me', {
			params: {
				header: {
					Authorization: `Bearer ${cookie}`,
				},
			},
		});

		if (error) return NextResponse.redirect(new URL('/login', request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
