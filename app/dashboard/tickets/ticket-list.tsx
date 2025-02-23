'use client';

import { useState } from 'react';

import { TicketCard } from '@/app/dashboard/tickets/ticket-card';
import { Pagination } from '@/components/pagination';

export type TicketStatus = 'Completed' | 'Pending' | 'Follow-Up';

export interface Ticket {
	additionalNote?: string;
	billingAddress: string;
	email: string;
	id: string;
	name: string;
	paymentMode: string;
	phone: string;
	status: TicketStatus;
	subscriptionDetails: string;
}

interface TicketListProps {
	readonly onStatusChangeAction: (params: { status: TicketStatus; ticketId: string }) => void;
	readonly tickets: Ticket[];
}

const itemsPerPage = 6;

export const TicketList = ({ onStatusChangeAction, tickets }: TicketListProps) => {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(tickets.length / itemsPerPage);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentTickets = tickets.slice(startIndex, endIndex);

	return (
		<>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{currentTickets.map((ticket) => (
					<TicketCard
						key={ticket.id}
						{...ticket}
						onStatusChange={(status) => onStatusChangeAction({ status, ticketId: ticket.id })}
						ticketId={ticket.id}
					/>
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
