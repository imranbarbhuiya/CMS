import { Search } from 'lucide-react';

import { LeadsTable } from '@/components/leads-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LeadsPage() {
	return (
		<div className="space-y-4 p-8">
			<div className="flex items-center justify-start">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Leads</h1>
				{/* <div className="flex items-center gap-2">
					<Button className="gap-2" variant="outline">
						Filters
						<ChevronsUpDown className="size-4" />
					</Button>
				</div> */}
			</div>
			<div className="flex items-center gap-2">
				<Input className="max-w-sm" placeholder="Search lead using name, email" />
				<Button className="text-sm font-medium leading-6 text-primary" size="sm" variant="secondary">
					<Search className="size-4" />
					Search
				</Button>
			</div>
			<div className="rounded-md border bg-white">
				<LeadsTable />
			</div>
		</div>
	);
}
