'use client';

import { FileOutput, Search } from 'lucide-react';

import { AuditLogsTable, auditLogs } from '@/app/dashboard/audit-logs/audit-logs-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AuditLogsPage() {
	const handleExport = () => {
		const jsonString = JSON.stringify(auditLogs, null, 2);
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

	return (
		<div className="space-y-4 p-3 md:p-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Audit Logs</h1>
			</div>
			<div className="flex items-center justify-between">
				<div className="relative w-full max-w-sm">
					<Input className="pr-8" placeholder="Search logs" />
					<Button className="absolute right-0 top-0" size="icon" variant="ghost">
						<Search className="size-4" />
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Button className="gap-2" onClick={handleExport} variant="outline">
						<FileOutput className="size-4" />
						Export Logs
					</Button>
				</div>
			</div>
			<div className="rounded-md border">
				<AuditLogsTable />
			</div>
		</div>
	);
}
