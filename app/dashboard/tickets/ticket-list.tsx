'use client';

import { useState } from 'react';

import { TicketCard, type TicketWithLeadDto } from '@/app/dashboard/tickets/ticket-card';
import { Pagination } from '@/components/pagination';

interface TicketListProps {
	readonly onStatusChangeAction: (params: { status: TicketWithLeadDto['status']; ticketId: string }) => void;
	readonly tickets: TicketWithLeadDto[];
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
