'use client';

import { useQuery } from '@tanstack/react-query';
import { FileOutput, Search } from 'lucide-react';
import { useRef, useState } from 'react';

import { AuditLogsTable } from '@/app/dashboard/audit-logs/audit-logs-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToken } from '@/hooks/use-token';
import { Api } from '@/lib/fetch';

export default function AuditLogsPage() {
	const { data: token } = useToken();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data, isLoading } = useQuery({
		queryKey: ['/audit-logs', currentPage, itemsPerPage, searchTerm],
		queryFn: async () => {
			const { data, error } = await Api.GET('/audit-log', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					query: {
						search: searchTerm || undefined,
						page: currentPage,
						limit: itemsPerPage,
					},
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		enabled: Boolean(token),
		refetchInterval: 5_000,
	});

	const logs = data?.data ?? [];
	const totalItems = data?.count ?? 0;
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const handleExport = () => {
		if (!logs.length) return;
		const jsonString = JSON.stringify(logs, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'audit_logs.json';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleSearch = () => {
		setSearchTerm(searchInputRef.current?.value ?? '');
		setCurrentPage(1);
	};

	return (
		<div className="space-y-4 p-3 md:p-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Audit Logs</h1>
			</div>
			<div className="flex items-center justify-between">
				<div className="relative w-full max-w-sm">
					<Input
						className="pr-8"
						onKeyDown={(ev) => {
							if (ev.key === 'Enter') handleSearch();
						}}
						placeholder="Search logs"
						ref={searchInputRef}
					/>
					<Button className="absolute right-0 top-0" onClick={handleSearch} size="icon" variant="ghost">
						<Search className="size-4" />
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Button className="gap-2" disabled={!logs.length} onClick={handleExport} variant="outline">
						<FileOutput className="size-4" />
						Export Logs
					</Button>
				</div>
			</div>
			{isLoading ? (
				<div className="flex items-center justify-center pt-20">
					<div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
				</div>
			) : logs.length ? (
				<div className="rounded-md border">
					<AuditLogsTable
						currentPage={currentPage}
						itemsPerPage={itemsPerPage}
						logs={logs}
						onItemsPerPageChange={(value) => {
							setItemsPerPage(value);
							setCurrentPage(1);
						}}
						onPageChange={setCurrentPage}
						totalPages={totalPages}
					/>
				</div>
			) : (
				<div className="flex items-center justify-center pt-20">
					<p className="text-2xl font-medium leading-8 tracking-[-0.6px] text-primary">No audit logs found</p>
				</div>
			)}
		</div>
	);
}
