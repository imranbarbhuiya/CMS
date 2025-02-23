import { Pagination } from '@/components/pagination';

import type { components } from '@/openapi/api';

export type AuditLog = components['schemas']['FindAllAuditLogsDto']['data'][number];

interface AuditLogsTableProps {
	readonly currentPage: number;
	readonly itemsPerPage: number;
	readonly logs: AuditLog[];
	readonly onItemsPerPageChange: (value: number) => void;
	readonly onPageChange: (page: number) => void;
	readonly totalPages: number;
}

export function AuditLogsTable({
	logs,
	currentPage,
	itemsPerPage,
	totalPages,
	onPageChange,
	onItemsPerPageChange,
}: AuditLogsTableProps) {
	return (
		<div className="w-full">
			<div className="divide-y divide-border rounded-md border">
				{logs.map((log) => (
					<div className="px-6 py-4 text-sm hover:bg-muted/50" key={log.id}>
						{log.message}
					</div>
				))}
			</div>
			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				onItemsPerPageChange={onItemsPerPageChange}
				onPageChange={onPageChange}
				totalPages={totalPages}
			/>
		</div>
	);
}
