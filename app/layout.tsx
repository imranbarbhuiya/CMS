import { Geist } from 'next/font/google';

import { Providers } from './providers';

import type { Metadata } from 'next';

import './globals.css';

const geist = Geist({
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'CMS',
	description: 'cms',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geist.className} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
