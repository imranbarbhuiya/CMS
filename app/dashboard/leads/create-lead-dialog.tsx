'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateLeadDialogProps {
	readonly isPending: boolean;
	readonly onOpenChangeAction: (open: boolean) => void;
	readonly onSubmitAction: (data: { email: string; name: string; phone: string }) => void;
	readonly open: boolean;
}

export function CreateLeadDialog({ isPending, onOpenChangeAction, onSubmitAction, open }: CreateLeadDialogProps) {
	const [formData, setFormData] = useState({
		email: '',
		name: '',
		phone: '',
	});

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onSubmitAction(formData);
	};

	return (
		<Dialog onOpenChange={onOpenChangeAction} open={open}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="self-stretch text-center text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-themecolor-600">
						Create New Lead
					</DialogTitle>
				</DialogHeader>
				<form className="grid gap-4 py-4" onSubmit={handleSubmit}>
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							className="h-9"
							id="name"
							onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
							required
							value={formData.name}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							className="h-9"
							id="email"
							onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
							required
							type="email"
							value={formData.email}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="phone">Mobile Number</Label>
						<Input
							className="h-9"
							id="phone"
							onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
							required
							type="tel"
							value={formData.phone}
						/>
					</div>
					<Button className="bg-themecolor-600 hover:bg-themecolor-500" disabled={isPending} type="submit">
						{isPending ? 'Creating...' : 'Create Lead'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
