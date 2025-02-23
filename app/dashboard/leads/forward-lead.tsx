'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface LeadDialogProps {
	readonly onOpenChange: (open: boolean) => void;
	readonly open: boolean;
}

export function LeadDialog({ open, onOpenChange }: LeadDialogProps) {
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-base font-medium">Lead Details</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input className="h-9" defaultValue="Priya Sharma" id="name" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input className="h-9" defaultValue="priya.sharma@email.com" id="email" type="email" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="mobile">Mobile Number</Label>
						<Input className="h-9" defaultValue="9234566364" id="mobile" type="tel" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="subscription">Subscription Details</Label>
						<Input className="h-9" defaultValue="3years" id="subscription" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="address">Billing Address</Label>
						<Input className="h-9" defaultValue="402 Greenfield Complex, Mumbai, MH 400003, India" id="address" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="payment">Payment Mode</Label>
						<Input className="h-9" defaultValue="Cheque" id="payment" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="note">Additional Note</Label>
						<Textarea
							className="min-h-[100px]"
							defaultValue="Customer showed interest in upgrading to the premium package within the next quarter. Offered a 10% discount as an incentive, and they requested a follow-up call in two weeks to discuss further details."
							id="note"
						/>
					</div>
					<div className="text-sm text-muted-foreground">Note: Payment is still pending</div>
				</div>
				<div className="flex gap-2">
					<Button className="flex-1" onClick={() => onOpenChange(false)} variant="outline">
						Cancel
					</Button>
					<Button className="flex-1">Forward Lead</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
