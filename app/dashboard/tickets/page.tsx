import { ArrowDownWideNarrow, Search } from 'lucide-react';

import { TicketList } from '@/app/dashboard/tickets/ticket-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { Ticket } from '@/app/dashboard/tickets/ticket-list';

const MOCK_TICKETS: Ticket[] = [
	{
		ticketId: '0001',
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		phone: '9210823038',
		subscriptionDetails: '2 Years',
		billingAddress: '402 Greenfield Complex',
		paymentMode: 'Cheque',
		status: 'completed',
		additionalNote:
			'Customer showed interest in upgrading to the premium package within the next quarter. Offered a 10% discount as an incentive, and they requested a follow-up call in two weeks to discuss further details.',
	},
	{
		ticketId: '0002',
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		phone: '9210823038',
		subscriptionDetails: '2 Years',
		billingAddress: '402 Greenfield Complex',
		paymentMode: 'Cheque',
		status: 'pending',
	},
	{
		ticketId: '0003',
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		phone: '9210823038',
		subscriptionDetails: '2 Years',
		billingAddress: '402 Greenfield Complex',
		paymentMode: 'Cheque',
		status: 'follow-up',
		additionalNote: 'Customer showed interest in upgrading to the premium package within the next quarter.',
	},
];

export default function TicketPage() {
	return (
		<div className="space-y-4 p-3 md:p-8">
			<div className="flex items-center justify-start">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Tickets</h1>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Input className="max-w-sm" placeholder="Search ticket using name, id..." />
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
			<TicketList tickets={MOCK_TICKETS} />
		</div>
	);
}
