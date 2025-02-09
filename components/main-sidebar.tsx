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

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export function MainSidebar() {
	const { state } = useSidebar();

	return (
		<Sidebar
			className={cn(
				'flex h-screen flex-col justify-between border-r bg-white transition-all duration-300',
				state === 'collapsed' ? 'w-[80px]' : 'w-60',
			)}
			collapsible="icon"
		>
			<SidebarHeader className="self-stretch bg-blue-600 p-2">
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
								<SidebarMenuButton asChild>
									<Link
										className="flex items-center gap-3 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
										href="/dashboard"
									>
										<LayoutDashboard className="size-4" />
										<span>Overview</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										className="flex items-center gap-3 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
										href="/dashboard/leads"
									>
										<UserRound className="size-4" />
										<span>Leads</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										className="flex items-center gap-3 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
										href="/dashboard/ticket-overview"
									>
										<Ticket className="size-4" />
										<span>Ticket Overview</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										className="flex items-center gap-3 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
										href="/dashboard/tickets"
									>
										<Ticket className="size-4" />
										<span>Tickets</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										className="flex items-center gap-3 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
										href="/dashboard/manage-user"
									>
										<UserRound className="size-4" />
										<span>Manage User</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										className="flex items-center gap-3 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
										href="/dashboard/teams"
									>
										<Users className="size-4" />
										<span>Teams</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										className="flex items-center gap-3 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
										href="/dashboard/announcement"
									>
										<Megaphone className="size-4" />
										<span>Announcement</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										className="flex items-center gap-3 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
										href="/dashboard/audit-logs"
									>
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
						<AvatarImage alt="Rahul" src="/images/avatar.jpg" />
						<AvatarFallback>R</AvatarFallback>
					</Avatar>
					<div className="flex flex-[1_0_0] flex-col items-start gap-0.5">
						<span className="text-ellipsis text-sm font-semibold leading-[100%] text-blue-600">Rahul</span>
						<span className="text-ellipsis text-xs font-normal leading-4 text-blue-800">Sales</span>
					</div>
				</div>
				<div className="flex flex-col items-start self-stretch py-2">
					<Button
						className="flex min-w-[64px] items-center justify-center self-stretch rounded-md border border-solid border-border bg-background px-2 py-1.5 text-destructive transition-all duration-300 hover:bg-destructive hover:text-white"
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
