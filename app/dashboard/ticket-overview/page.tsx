'use client';

import { ArrowDownWideNarrow, Search } from 'lucide-react';
import { useState } from 'react';

import { TicketBoard } from '@/app/dashboard/ticket-overview/ticket-board';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { Ticket } from '@/app/dashboard/tickets/ticket-list';

const MOCK_TICKETS: Ticket[] = [
	{
		id: '0001',
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		phone: '9210823038',
		subscriptionDetails: '2 Years',
		billingAddress: '402 Greenfield Complex',
		paymentMode: 'Cheque',
		status: 'Completed',
		additionalNote:
			'Customer showed interest in upgrading to the premium package within the next quarter. Offered a 10% discount as an incentive, and they requested a follow-up call in two weeks to discuss further details.',
	},
	{
		id: '0002',
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		phone: '9210823038',
		subscriptionDetails: '2 Years',
		billingAddress: '402 Greenfield Complex',
		paymentMode: 'Cheque',
		status: 'Pending',
	},
	{
		id: '0003',
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		phone: '9210823038',
		subscriptionDetails: '2 Years',
		billingAddress: '402 Greenfield Complex',
		paymentMode: 'Cheque',
		status: 'Follow-Up',
		additionalNote: 'Customer showed interest in upgrading to the premium package within the next quarter.',
	},
	{
		id: '0004',
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		phone: '9210823038',
		subscriptionDetails: '2 Years',
		billingAddress: '402 Greenfield Complex',
		paymentMode: 'Cheque',
		status: 'Pending',
		additionalNote: 'Customer showed interest in upgrading to the premium package within the next quarter.',
	},
	{
		id: '0005',
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		phone: '9210823038',
		subscriptionDetails: '2 Years',
		billingAddress: '402 Greenfield Complex',
		paymentMode: 'Cheque',
		status: 'Completed',
		additionalNote: 'Customer showed interest in upgrading to the premium package within the next quarter.',
	},
	{
		id: '0006',
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		phone: '9210823038',
		subscriptionDetails: '2 Years',
		billingAddress: '402 Greenfield Complex',
		paymentMode: 'Cheque',
		status: 'Follow-Up',
		additionalNote: 'Customer showed interest in upgrading to the premium package within the next quarter.',
	},
];

export default function TicketOverviewPage() {
	const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
	const [searchQuery, setSearchQuery] = useState('');

	const handleStatusChange = (id: string, newStatus: Ticket['status']) => {
		setTickets((prevTickets) =>
			prevTickets.map((ticket) => (ticket.id === id ? { ...ticket, status: newStatus } : ticket)),
		);
	};

	const filteredTickets = tickets.filter(
		(ticket) =>
			ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			ticket.id.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="space-y-4 p-3 md:p-8">
			<div className="flex items-center justify-start">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Ticket Overview</h1>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Input
						className="max-w-sm"
						onChange={(ev) => setSearchQuery(ev.target.value)}
						placeholder="Search ticket using name, id..."
						value={searchQuery}
					/>
					<Button className="text-sm font-medium leading-6 text-primary" size="sm" variant="secondary">
						<Search className="size-4" />
						Search
					</Button>
				</div>
				<Button className="gap-2" variant="outline">
					Sort-By
					<ArrowDownWideNarrow className="size-4" />
				</Button>
			</div>
			<TicketBoard onStatusChange={handleStatusChange} tickets={filteredTickets} />
			<Pagination currentPage={1} itemsPerPage={9} onPageChange={() => null} totalPages={1} />
		</div>
	);
}
