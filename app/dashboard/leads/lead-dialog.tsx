'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LeadDialogProps {
	readonly onOpenChange: (open: boolean) => void;
	readonly open: boolean;
}

export function LeadDialog({ open, onOpenChange }: LeadDialogProps) {
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-center text-base font-medium">Incoming Lead</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input className="h-9" defaultValue="Emily Carter" id="name" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input className="h-9" defaultValue="emily.carter@gmail.com" id="email" type="email" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="mobile">Mobile Number</Label>
						<Input className="h-9" defaultValue="+1 2359283653" id="mobile" type="tel" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="leadId">Lead ID</Label>
						<Input className="h-9" defaultValue="#2032" id="leadId" />
					</div>
				</div>
				<Button className="w-full" size="sm">
					Accept
				</Button>
			</DialogContent>
		</Dialog>
	);
}
