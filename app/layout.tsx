import { Geist } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { isRoseGroupFlag } from '@/lib/group-flag';

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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const isRoseGroup = await isRoseGroupFlag();

	return (
		<html lang="en">
			<body className={`${geist.className} ${isRoseGroup ? 'rose' : ''} antialiased`}>
				<Providers>
					<Toaster />
					{children}
				</Providers>
			</body>
		</html>
	);
}
