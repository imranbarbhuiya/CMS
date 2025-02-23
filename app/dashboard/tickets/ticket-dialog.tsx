import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToken } from '@/hooks/use-token';
import { Api } from '@/lib/fetch';

import type { components } from '@/openapi/api';

export type LeadDto = components['schemas']['LeadDto'];

interface LeadDialogProps {
	readonly address?: string;
	readonly isForward?: boolean;
	readonly lead?: LeadDto;
	readonly note?: string;
	readonly onOpenChange: (open: boolean) => void;
	readonly open: boolean;
	readonly payment?: string;
	readonly subscription?: string;
}

export function ForwardLeadDialog({
	open,
	onOpenChange,
	lead,
	isForward,
	subscription,
	address,
	payment,
	note,
}: LeadDialogProps) {
	const queryClient = useQueryClient();
	const { data: token } = useToken();

	const { mutateAsync: claimTicket, isPending: isClaimPending } = useMutation({
		mutationFn: async () => {
			const { data, error } = await Api.POST('/tickets/{id}/claim', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					path: {
						id: lead!.id,
					},
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['/tickets/my'] });
			onOpenChange(false);
		},
	});

	const { mutateAsync: forwardTicket, isPending: isForwardPending } = useMutation({
		mutationFn: async () => {
			const { data, error } = await Api.POST('/tickets', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
				},
				body: {
					leadId: lead!.id,
					additionalInfo: JSON.stringify({
						subscription,
						address,
						payment,
						note,
					}),
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['/tickets'] });
			onOpenChange(false);
		},
	});

	if (!lead) return null;

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="self-stretch text-center text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-themecolor-600">
						{isForward ? 'Lead Details' : 'Incoming Ticket'}
					</DialogTitle>
				</DialogHeader>
				<DialogHeader>
					<DialogTitle className="text-base font-medium">Lead Details</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input className="h-9" defaultValue={lead.name} id="name" readOnly />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input className="h-9" defaultValue={lead.email} id="email" readOnly type="email" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="mobile">Mobile Number</Label>
						<Input className="h-9" defaultValue={lead.phone} id="mobile" readOnly type="tel" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="subscription">Subscription Details</Label>
						<Input className="h-9" defaultValue={subscription} id="subscription" readOnly={!isForward} />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="address">Billing Address</Label>
						<Input className="h-9" defaultValue={address} id="address" readOnly={!isForward} />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="payment">Payment Mode</Label>
						<Input className="h-9" defaultValue={payment} id="payment" readOnly={!isForward} />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="note">Additional Note</Label>
						<Textarea
							className="min-h-[100px]"
							defaultValue={note}
							id="note"
							placeholder="Add any notes or context for forwarding"
							readOnly={!isForward}
						/>
					</div>
					{lead.status === 'Payment Pending' && (
						<p className="text-sm text-muted-foreground">Note: Payment is still pending</p>
					)}
				</div>
				{isForward ? (
					<div className="flex gap-2">
						<Button className="flex-1" onClick={() => onOpenChange(false)} variant="outline">
							Cancel
						</Button>
						<Button
							className="flex-1 bg-themecolor-600 hover:bg-themecolor-500"
							disabled={isForwardPending}
							onClick={() => forwardTicket()}
						>
							{isForwardPending ? 'Forwarding...' : 'Forward Lead'}
						</Button>
					</div>
				) : (
					<Button
						className="flex-1 bg-themecolor-600 hover:bg-themecolor-500"
						disabled={isClaimPending}
						onClick={() => claimTicket()}
					>
						{isClaimPending ? 'Accepting...' : 'Accept'}
					</Button>
				)}
			</DialogContent>
		</Dialog>
	);
}
