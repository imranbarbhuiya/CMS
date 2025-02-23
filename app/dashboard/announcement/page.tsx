'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToken } from '@/hooks/use-token';
import { Api } from '@/lib/fetch';

const formSchema = z
	.object({
		sendToEveryone: z.boolean().default(false),
		users: z.array(z.string()).optional(),
		teams: z.array(z.string()).optional(),
		message: z.string().min(1, 'Message is required'),
	})
	.superRefine((data, ctx) => {
		if (!data.sendToEveryone && !data.users?.length && !data.teams?.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Please select at least one member',
				path: ['users'],
			});

			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Please select at least one team',
				path: ['teams'],
			});
		}
	});

export default function AnnouncementPage() {
	const { data: token } = useToken();

	const { data: users } = useQuery({
		queryKey: ['/all'],
		queryFn: async ({ signal }) => {
			const { data, error } = await Api.GET('/all', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
				},
				signal,
			});

			if (error) throw new Error(error.message ?? 'An error occurred');
			return data;
		},
		enabled: Boolean(token),
	});

	const { data: teams } = useQuery({
		queryKey: ['/teams'],
		queryFn: async ({ signal }) => {
			const { data, error } = await Api.GET('/teams', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
				},
				signal,
			});

			if (error) throw new Error(error.message ?? 'An error occurred');
			return data;
		},
		enabled: Boolean(token),
	});

	const members =
		users?.data.map((user) => ({
			value: user.id.toString(),
			label: user.name,
		})) ?? [];

	const teamOptions =
		teams?.data.map((team) => ({
			value: team.id,
			label: team.name,
		})) ?? [];

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sendToEveryone: false,
			users: [],
			teams: [],
			message: '',
		},
	});

	const sendToEveryone = form.watch('sendToEveryone');

	const mutation = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			const { error } = await Api.POST('/announcement', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
				},
				body: {
					message: values.message,
					...(values.sendToEveryone
						? {
								everyone: true,
							}
						: {
								users: values.users,
								teams: values.teams?.map((team) => ({
									id: team,
									roles: 'all' as const,
									companyId: 'Blue Company' as const,
								})),
							}),
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await mutation.mutateAsync(values);

			toast.success('Announcement sent successfully');

			form.reset();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to send announcement');
		}
	};

	return (
		<div className="space-y-4 p-3 md:p-8">
			<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Announcement</h1>
			<Card className="max-w-[600px]">
				<CardHeader>
					<CardTitle>Send Announcement</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<Form {...form}>
						<form className="space-y-4 p-4" onSubmit={form.handleSubmit(handleSubmit, console.error)}>
							<FormField
								control={form.control}
								name="sendToEveryone"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">Send to Everyone</FormLabel>
											<div className="text-sm text-muted-foreground">
												Send this announcement to all members and teams
											</div>
										</div>
										<FormControl>
											<Switch checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
									</FormItem>
								)}
							/>
							{!sendToEveryone && (
								<>
									<FormField
										control={form.control}
										name="users"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Member</FormLabel>
												<FormControl>
													<MultiSelect
														onChange={field.onChange}
														options={members}
														placeholder="Select Member"
														selected={field.value ?? []}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="teams"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Team</FormLabel>
												<FormControl>
													<MultiSelect
														onChange={field.onChange}
														options={teamOptions}
														placeholder="Select Team"
														selected={field.value ?? []}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Message</FormLabel>
										<FormControl>
											<Textarea
												className="min-h-[100px] resize-none"
												placeholder="Type your announcement message..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="-mx-4 border-t border-solid border-border p-4">
								<Button className="w-full bg-themecolor-500 hover:bg-themecolor-600" type="submit">
									{mutation.isPending ? 'Sending...' : 'Send Notification'}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
