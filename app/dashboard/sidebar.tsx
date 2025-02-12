'use client';

import {
	LayoutDashboard,
	UserRound,
	Ticket,
	Users,
	Megaphone,
	ScrollText,
	LogOut,
	GalleryVerticalEnd,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';

export function MainSidebar() {
	const { state } = useSidebar();
	const router = useRouter();

	return (
		<Sidebar
			className={cn(
				'flex h-screen flex-col justify-between border-r bg-white transition-all duration-300',
				state === 'collapsed' ? 'w-[80px]' : 'w-60',
			)}
			collapsible="icon"
		>
			<SidebarHeader className="self-stretch bg-themecolor-600 p-2">
				{state === 'collapsed' ? (
					<div className="rounded-lg bg-sidebar-primary p-2">
						<GalleryVerticalEnd className="size-4 text-sidebar-primary-foreground" />
					</div>
				) : (
					<div className="flex items-center gap-2 self-stretch rounded-[8px] p-2">
						<div className="rounded-lg bg-sidebar-primary p-2">
							<GalleryVerticalEnd className="size-4 text-sidebar-primary-foreground" />
						</div>
						<div className="flex flex-[1_0_0] flex-col items-start gap-0.5">
							<span className="text-ellipsis text-sm font-semibold leading-[100%] text-white">
								Wingspire Soft Solutions
							</span>
							<span className="text-ellipsis text-xs font-normal leading-4 text-white">Advertising wing Inc</span>
						</div>
					</div>
				)}
			</SidebarHeader>
			<SidebarContent className="py-2">
				<SidebarGroup>
					<SidebarGroupLabel>Dashboard</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="flex items-center gap-3 transition-all duration-300 hover:bg-themecolor-50 hover:text-themecolor-600"
								>
									<Link href="/dashboard">
										<LayoutDashboard className="size-4" />
										<span>Overview</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="flex items-center gap-3 transition-all duration-300 hover:bg-themecolor-50 hover:text-themecolor-600"
								>
									<Link href="/dashboard/leads">
										<UserRound className="size-4" />
										<span>Leads</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="flex items-center gap-3 transition-all duration-300 hover:bg-themecolor-50 hover:text-themecolor-600"
								>
									<Link href="/dashboard/ticket-overview">
										<Ticket className="size-4" />
										<span>Ticket Overview</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="flex items-center gap-3 transition-all duration-300 hover:bg-themecolor-50 hover:text-themecolor-600"
								>
									<Link href="/dashboard/tickets">
										<Ticket className="size-4" />
										<span>Tickets</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="flex items-center gap-3 transition-all duration-300 hover:bg-themecolor-50 hover:text-themecolor-600"
								>
									<Link href="/dashboard/manage-user">
										<UserRound className="size-4" />
										<span>Manage User</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="flex items-center gap-3 transition-all duration-300 hover:bg-themecolor-50 hover:text-themecolor-600"
								>
									<Link href="/dashboard/teams">
										<Users className="size-4" />
										<span>Teams</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="flex items-center gap-3 transition-all duration-300 hover:bg-themecolor-50 hover:text-themecolor-600"
								>
									<Link href="/dashboard/announcement">
										<Megaphone className="size-4" />
										<span>Announcement</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="flex items-center gap-3 transition-all duration-300 hover:bg-themecolor-50 hover:text-themecolor-600"
								>
									<Link href="/dashboard/audit-logs">
										<ScrollText className="size-4" />
										<span>Audit Logs</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="self-stretch">
				<div className="flex items-center gap-2 self-stretch rounded-[6px] p-2">
					<Avatar className="size-8">
						<AvatarImage alt="Saleem" src="/images/avatar.jpg" />
						<AvatarFallback>S</AvatarFallback>
					</Avatar>
					<div className="flex flex-[1_0_0] flex-col items-start gap-0.5">
						<span className="text-ellipsis text-sm font-semibold leading-[100%] text-themecolor-600">Saleem</span>
						<span className="text-ellipsis text-xs font-normal leading-4 text-themecolor-800">Admin</span>
					</div>
				</div>
				<div className="flex flex-col items-start self-stretch py-2">
					<Button
						className="flex min-w-[64px] items-center justify-center self-stretch rounded-md border border-solid border-border bg-background px-2 py-1.5 text-destructive transition-all duration-300 hover:bg-destructive hover:text-white"
						onClick={() => router.push('/login')}
						size="sm"
						variant="outline"
					>
						Logout <LogOut className="size-4" />
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
