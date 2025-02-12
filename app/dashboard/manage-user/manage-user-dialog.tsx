import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, KeyRound, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const userSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
});

type UserFormValues = z.infer<typeof userSchema>;

interface User {
	email: string;
	id: number;
	name: string;
	teamName: string;
	teamRole: string;
}

interface UserDialogProps {
	readonly mode: 'add' | 'edit';
	readonly onUserAdded?: (user: User) => void;
	readonly onUserUpdated?: (user: User) => void;
	readonly trigger?: React.ReactNode;
	readonly user?: User;
}

export function UserDialog({ mode, user, onUserAdded, onUserUpdated, trigger }: UserDialogProps) {
	const [open, setOpen] = useState(false);
	const isEdit = mode === 'edit';

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		if (isEdit && user) {
			form.reset({
				name: user.name,
				email: user.email,
				password: '', // We don't show the actual password when editing
			});
		}
	}, [isEdit, user, form]);

	const generatePassword = useCallback(() => {
		const length = 12;
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
		let password = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length);
			password += charset[randomIndex];
		}
		form.setValue('password', password);
	}, [form]);

	const handleCopyPassword = useCallback(() => {
		void navigator.clipboard.writeText(form.getValues('password'));
		toast('Password copied to clipboard');
	}, [form]);

	const onSubmit = (data: UserFormValues) => {
		if (isEdit && user) {
			const updatedUser = {
				...user,
				...data,
			};
			onUserUpdated?.(updatedUser);
		} else {
			const newUser = {
				...data,
				id: Math.floor(Math.random() * 1_000),
				teamName: 'Not Assigned',
				teamRole: 'Not Assigned',
			};
			onUserAdded?.(newUser);
		}
		setOpen(false);
		form.reset();
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button className="gap-2" variant="outline">
						<Plus className="size-4" />
						Add User
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Name of the user" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Email of the user" type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<div className="space-y-2">
										<div className="flex gap-2">
											<FormControl>
												<Input placeholder="Generated password" type="text" {...field} />
											</FormControl>
											<Button
												disabled={!field.value}
												onClick={handleCopyPassword}
												size="icon"
												type="button"
												variant="outline"
											>
												<Copy className="size-4" />
											</Button>
										</div>
										<Button className="w-full" onClick={generatePassword} type="button" variant="outline">
											<KeyRound className="mr-2 size-4" />
											Generate Password
										</Button>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full bg-themecolor-600 hover:bg-themecolor-500" type="submit">
							{isEdit ? 'Update User' : 'Add User'}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
