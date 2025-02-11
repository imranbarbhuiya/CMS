'use client';

import { Bell, PanelLeft, Search, Slash } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';

export function MainHeader() {
	const pathname = usePathname();
	const { toggleSidebar } = useSidebar();

	const paths = pathname.split('/').filter(Boolean);
	const currentPage = paths[paths.length - 1];

	return (
		<div className="bg-white">
			<div className="flex h-14 items-center justify-between px-4">
				<div className="flex items-center gap-4">
					<Button className="size-9" onClick={toggleSidebar} size="icon" variant="ghost">
						<PanelLeft className="size-5" />
					</Button>
					<div className="hidden items-center gap-2 md:flex">
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink asChild className="text-sm font-normal leading-5 text-muted-foreground">
										<Link href="/dashboard/overview">Dashboard</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator>
									<Slash className="size-4" />
								</BreadcrumbSeparator>
								<BreadcrumbItem>
									<BreadcrumbPage className="text-sm font-normal leading-5 text-themecolor-600 hover:text-themecolor-700">
										{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input className="h-9 w-[240px] pl-8" placeholder="Type a command or search..." type="search" />
					</div>
					<Button className="size-9" size="icon" variant="ghost">
						<Bell className="size-5" />
					</Button>
					<Avatar className="size-10">
						<AvatarImage alt="RA" src="/rahul.jpg" />
						<AvatarFallback>RA</AvatarFallback>
					</Avatar>
				</div>
			</div>
		</div>
	);
}
