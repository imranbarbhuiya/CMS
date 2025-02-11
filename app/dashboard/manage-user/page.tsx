'use client';

import { FileOutput, Plus, Search } from 'lucide-react';

import { ManageUserTable, users } from '@/app/dashboard/manage-user/manage-user-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ManageUserPage() {
	const handleExport = () => {
		const jsonString = JSON.stringify(users, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'users.json';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="space-y-4 p-3 md:p-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Manage User</h1>
			</div>
			<div className="flex flex-col-reverse items-start justify-between md:flex-row md:items-center">
				<div className="flex items-center gap-2">
					<Input className="max-w-sm" placeholder="Search user by name, email" />
					<Button className="text-sm font-medium leading-6 text-primary" size="sm" variant="secondary">
						<Search className="size-4" />
						Search
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Button className="gap-2" onClick={handleExport} variant="outline">
						<FileOutput className="size-4" />
						Export All Data
					</Button>
					<Button className="gap-2" variant="outline">
						<Plus className="size-4" />
						Add User
					</Button>
				</div>
			</div>
			<div className="rounded-md border">
				<ManageUserTable />
			</div>
		</div>
	);
}
