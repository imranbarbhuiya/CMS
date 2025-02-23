import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToken } from '@/hooks/use-token';
import { Api } from '@/lib/fetch';

import type { components } from '@/openapi/api';

type LeadDto = components['schemas']['LeadDto'];

interface LeadDialogProps {
	readonly lead?: LeadDto;
	readonly onOpenChange: (open: boolean) => void;
	readonly open: boolean;
	readonly showAcceptButton?: boolean;
}

export function LeadDialog({ lead, onOpenChange, open, showAcceptButton }: LeadDialogProps) {
	const queryClient = useQueryClient();
	const { data: token } = useToken();

	const { mutateAsync: acceptLead, isPending } = useMutation({
		mutationFn: async () => {
			if (!lead) throw new Error('No lead to accept');

			const { data, error } = await Api.POST('/leads/{id}/claim', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					path: {
						id: lead.id,
					},
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['/leads'] });
			onOpenChange(false);
		},
	});

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="self-stretch text-center text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-themecolor-600">
						{showAcceptButton ? 'Incoming Lead' : 'Lead Details'}
					</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input className="h-9" id="name" readOnly value={lead?.name ?? ''} />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input className="h-9" id="email" readOnly type="email" value={lead?.email ?? ''} />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="mobile">Mobile Number</Label>
						<Input className="h-9" id="mobile" readOnly type="tel" value={lead?.phone ?? ''} />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="leadId">Lead ID</Label>
						<Input className="h-9" id="leadId" readOnly value={lead?.internalLeadId ?? ''} />
					</div>
				</div>
				{showAcceptButton && (
					<Button
						className="bg-themecolor-600 hover:bg-themecolor-500"
						disabled={isPending}
						onClick={() => acceptLead()}
						size="sm"
					>
						{isPending ? 'Accepting...' : 'Accept'}
					</Button>
				)}
			</DialogContent>
		</Dialog>
	);
}
