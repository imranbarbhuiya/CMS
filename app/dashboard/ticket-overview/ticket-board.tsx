import clsx from 'clsx';
import { ArrowDownUp } from 'lucide-react';
import { div as MotionDiv } from 'motion/react-client';

import { TicketCard } from '@/app/dashboard/tickets/ticket-card';

import type { Ticket } from '@/app/dashboard/tickets/ticket-list';

interface TicketBoardProps {
	readonly onStatusChange: (ticketId: string, status: Ticket['status']) => void;
	readonly tickets: Ticket[];
}

const statusGroups: { border: string; color: string; label: string; value: Ticket['status'] }[] = [
	{ label: 'Pending', value: 'pending', border: 'border-yellow-500', color: 'text-yellow-500' },
	{ label: 'Follow-up', value: 'follow-up', border: 'border-themecolor-600', color: 'text-themecolor-600' },
	{ label: 'Completed', value: 'completed', border: 'border-green-600', color: 'text-green-600' },
];

export function TicketBoard({ tickets, onStatusChange }: TicketBoardProps) {
	return (
		<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
			{statusGroups.map(({ label, value, ...props }) => {
				const groupTickets = tickets.filter((ticket) => ticket.status === value);

				return (
					<div className="flex flex-col gap-4 self-stretch" key={value}>
						<div className={clsx('flex items-center border-b border-solid px-4 py-1', props.border)}>
							<div
								className={clsx(
									'flex min-w-[80px] items-center justify-center gap-1 rounded-md px-3 py-2',
									props.color,
								)}
							>
								<h2 className="text-sm font-medium leading-6">{label}</h2>
								<ArrowDownUp className="size-4" />
							</div>
						</div>
						<div className="flex flex-col gap-4">
							{groupTickets.map((ticket) => (
								<MotionDiv
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									initial={{ opacity: 0, scale: 0.8 }}
									key={ticket.ticketId}
									layout
									transition={{
										layout: { duration: 0.3 },
										opacity: { duration: 0.2 },
										scale: { duration: 0.2 },
									}}
								>
									<TicketCard
										{...ticket}
										minimal
										onStatusChange={(status) => onStatusChange(ticket.ticketId, status)}
									/>
								</MotionDiv>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}
