'use client';

import { useState } from 'react';

import { Pagination } from '@/components/pagination';

export interface AuditLog {
	actor: string;
	description: string;
	id: number;
	timestamp: string;
}

export const auditLogs: AuditLog[] = [
	{
		id: 1,
		timestamp: '2024-02-20 09:30:15',
		description: 'User Login: Admin user logged in from IP address 192.168.1.15.',
		actor: 'Admin user',
	},
	{
		id: 2,
		timestamp: '2024-02-20 10:15:22',
		description: 'Data Update: Customer record for "Emily Carter" updated - email address changed.',
		actor: 'Admin',
	},
	{
		id: 3,
		timestamp: '2024-02-20 11:00:05',
		description: 'Lead Created: New lead added - "James Henderson", source: Referral.',
		actor: 'Sales_Team_1',
	},
	{
		id: 4,
		timestamp: '2024-02-20 11:30:45',
		description: 'Task Assigned: Follow-up task assigned to "John Doe" for lead "Priya Sharma."',
		actor: 'Manager_Jane',
	},
	{
		id: 5,
		timestamp: '2024-02-20 12:00:00',
		description: 'Record Deleted: Customer record for "Mark Johnson" was deleted by "Admin."',
		actor: 'Admin',
	},
	{
		id: 6,
		timestamp: '2024-02-20 13:15:30',
		description: 'Role Change: User "Sophia Lee" promoted to Manager role in CRM.',
		actor: 'System Admin',
	},
	{
		id: 7,
		timestamp: '2024-02-20 14:00:10',
		description: 'Email Sent: Email campaign "January Offers" sent to 120 leads by "Sales_Team_1"',
		actor: 'Sales_Team_1',
	},
	{
		id: 8,
		timestamp: '2024-02-20 14:45:20',
		description: 'Payment Processed: Invoice #12345 for $1,200 marked as paid for "Michael Nguyen."',
		actor: 'Finance_Team',
	},
	{
		id: 9,
		timestamp: '2024-02-20 15:30:00',
		description: 'Lead Source Updated: Source for lead "Sofia Martinez" changed from "Social Media" to "Referral."',
		actor: 'Sales_Team_2',
	},
	{
		id: 10,
		timestamp: '2024-02-20 16:00:25',
		description: 'Login Failed: Unsuccessful login attempt for user "tech_support" from IP address 203.45.112.21.',
		actor: 'System',
	},
];

export function AuditLogsTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentLogs = auditLogs.slice(startIndex, endIndex);
	const totalPages = Math.ceil(auditLogs.length / itemsPerPage);

	return (
		<div className="w-full">
			<div className="divide-y divide-border rounded-md border">
				{currentLogs.map((log) => (
					<div className="px-6 py-4 text-sm hover:bg-muted/50" key={log.id}>
						{log.description}
					</div>
				))}
			</div>
			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				onItemsPerPageChange={(value) => {
					setItemsPerPage(value);
					setCurrentPage(1);
				}}
				onPageChange={setCurrentPage}
				totalPages={totalPages}
			/>
		</div>
	);
}
