'use client';

import { useState } from 'react';

import { TicketCard } from '@/app/dashboard/tickets/ticket-card';
import { Pagination } from '@/components/pagination';

export type TicketStatus = 'completed' | 'pending' | 'follow-up';

export interface Ticket {
	additionalNote?: string;
	billingAddress: string;
	email: string;
	name: string;
	paymentMode: string;
	phone: string;
	status: TicketStatus;
	subscriptionDetails: string;
	ticketId: string;
}

interface TicketListProps {
	readonly tickets: Ticket[];
}

const itemsPerPage = 6;

export const TicketList = ({ tickets }: TicketListProps) => {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(tickets.length / itemsPerPage);

	const handleStatusChange = (_ticketId: string) => (_status: TicketStatus) => {
		// Here you would typically update the status in your backend
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentTickets = tickets.slice(startIndex, endIndex);

	return (
		<>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{currentTickets.map((ticket) => (
					<TicketCard key={ticket.ticketId} {...ticket} onStatusChange={handleStatusChange(ticket.ticketId)} />
				))}
			</div>
			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				onPageChange={setCurrentPage}
				totalPages={totalPages}
			/>
		</>
	);
};
