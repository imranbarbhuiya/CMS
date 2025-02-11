import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type TicketStatus = 'completed' | 'pending' | 'follow-up';

interface TicketCardProps {
	readonly additionalNote?: string;
	readonly billingAddress: string;
	readonly email: string;
	readonly minimal?: boolean;
	readonly name: string;
	readonly onStatusChange?: (status: TicketStatus) => void;
	readonly paymentMode: string;
	readonly phone: string;
	readonly status: TicketStatus;
	readonly subscriptionDetails: string;
	readonly ticketId: string;
}

export const TicketCard = ({
	ticketId,
	name,
	email,
	phone,
	subscriptionDetails,
	billingAddress,
	paymentMode,
	additionalNote,
	status,
	minimal,
	onStatusChange,
}: TicketCardProps) => {
	const handleStatusChange = (value: string) => {
		onStatusChange?.(value as TicketStatus);
	};

	return (
		<Card>
			<CardHeader className="space-y-1.5">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<h2 className="text-2xl font-semibold">{name}</h2>
						<p className="text-sm text-muted-foreground">{email}</p>
						<p className="text-sm text-muted-foreground">{phone}</p>
					</div>
					<div className="text-sm text-muted-foreground">Ticket ID: {ticketId}</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{minimal ? null : (
					<>
						<div className="space-y-2">
							<Label>Subscription Details</Label>
							<Input className="bg-background" defaultValue={subscriptionDetails} readOnly />
						</div>
						<div className="space-y-2">
							<Label>Billing Address</Label>
							<Input className="bg-background" defaultValue={billingAddress} readOnly />
						</div>
						<div className="space-y-2">
							<Label>Payment Mode</Label>
							<Input className="bg-background" defaultValue={paymentMode} readOnly />
						</div>
						{additionalNote && (
							<div className="space-y-2">
								<Label>Additional Note</Label>
								<Textarea className="min-h-[100px] resize-none bg-background" defaultValue={additionalNote} readOnly />
							</div>
						)}
					</>
				)}
				<div className="space-y-2">
					<Label>Status</Label>
					<Select defaultValue={status} onValueChange={handleStatusChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="completed">Completed</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="follow-up">Follow-up</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	);
};
