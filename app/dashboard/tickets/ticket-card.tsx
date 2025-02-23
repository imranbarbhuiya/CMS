import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import type { components } from '@/openapi/api';

export type TicketWithLeadDto = components['schemas']['TicketWithLeadDto'];

interface TicketCardProps extends TicketWithLeadDto {
	readonly minimal?: boolean;
	readonly onStatusChange?: (status: TicketWithLeadDto['status']) => void;
}

export const TicketCard = ({ id, additionalInfo, leadDetails, status, minimal, onStatusChange }: TicketCardProps) => {
	const handleStatusChange = (value: string) => {
		onStatusChange?.(value as TicketWithLeadDto['status']);
	};

	return (
		<Card>
			<CardHeader className="space-y-1.5">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<h2 className="text-2xl font-semibold">{leadDetails.name}</h2>
						<p className="text-sm text-muted-foreground">{leadDetails.email}</p>
						<p className="text-sm text-muted-foreground">{leadDetails.phone}</p>
					</div>
					<div className="text-sm text-muted-foreground">Ticket ID: {id}</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{minimal ? null : (
					<>
						<div className="space-y-2">
							<Label>Subscription Details</Label>
							<Input className="bg-background" defaultValue={leadDetails.subscription} readOnly />
						</div>
						<div className="space-y-2">
							<Label>Billing Address</Label>
							<Input className="bg-background" defaultValue={leadDetails.billingAddress} readOnly />
						</div>
						<div className="space-y-2">
							<Label>Payment Mode</Label>
							<Input className="bg-background" defaultValue={leadDetails.paymentMethod} readOnly />
						</div>
						{additionalInfo && (
							<div className="space-y-2">
								<Label>Additional Note</Label>
								<Textarea className="min-h-[100px] resize-none bg-background" defaultValue={additionalInfo} readOnly />
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
							<SelectItem value="Completed">Completed</SelectItem>
							<SelectItem value="Pending">Pending</SelectItem>
							<SelectItem value="Follow-Up">Follow-up</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	);
};
