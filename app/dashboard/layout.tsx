import { MainHeader } from '@/app/dashboard/header';
import { MainSidebar } from '@/app/dashboard/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { isRoseGroupFlag } from '@/lib/group-flag';

export default async function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
	const isRoseGroup = await isRoseGroupFlag();

	return (
		<main className={isRoseGroup ? 'rose' : ''}>
			<SidebarProvider>
				<div className="flex h-screen w-full">
					<MainSidebar />
					<div className="flex w-full flex-1 flex-col">
						<MainHeader />
						<main className="flex-1 overflow-y-auto">{children}</main>
					</div>
				</div>
			</SidebarProvider>
		</main>
	);
}
