'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MultiSelect } from '@/components/multi-select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface User {
	id: string;
	name: string;
}

interface Team {
	id: string;
	name: string;
}

interface Announcement {
	author: {
		name: string;
	};
	date: string;
	members: string[];
	message: string;
	teams: string[];
}

const formSchema = z
	.object({
		sendToEveryone: z.boolean().default(false),
		members: z.array(z.string()),
		teams: z.array(z.string()),
		message: z.string().min(1, 'Message is required'),
	})
	.superRefine((data, ctx) => {
		if (!data.sendToEveryone) {
			if (data.members.length < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Please select at least one member',
					path: ['members'],
				});
			}
			if (data.teams.length < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Please select at least one team',
					path: ['teams'],
				});
			}
		}
	});

function AnnouncementToast({ announcement }: { readonly announcement: Announcement }) {
	return (
		<div className="flex items-start gap-4">
			<Avatar className="size-8">
				<AvatarFallback>{announcement.author.name.charAt(0)}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<span className="font-medium">{announcement.author.name}</span>
					<Badge className="text-[10px]" variant="secondary">
						{announcement.date}
					</Badge>
				</div>
				<p className="text-sm text-muted-foreground">{announcement.message}</p>
			</div>
		</div>
	);
}

export default function AnnouncementPage() {
	const { data: users = [] } = useQuery<User[]>({
		queryKey: ['users'],
	});

	const { data: teams = [] } = useQuery<Team[]>({
		queryKey: ['teams'],
	});

	const members = users.map((user) => ({
		value: user.id.toString(),
		label: user.name,
	}));

	const teamOptions = teams.map((team) => ({
		value: team.id,
		label: team.name,
	}));

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sendToEveryone: false,
			members: [],
			teams: [],
			message: '',
		},
	});

	const sendToEveryone = form.watch('sendToEveryone');

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		const announcement: Announcement = {
			message: values.message,
			author: {
				name: 'Admin', // Replace with actual logged in user name
			},
			date: new Date().toLocaleDateString(),
			teams: values.teams,
			members: values.members,
		};

		const audio = new Audio('/notification.mp3');
		// eslint-disable-next-line promise/prefer-await-to-then
		audio.play().catch(console.error);

		toast.success('Announcement sent successfully');

		toast(<AnnouncementToast announcement={announcement} />, {
			duration: 4_000,
		});
		form.reset();
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
										name="members"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Member</FormLabel>
												<FormControl>
													<MultiSelect
														onChange={field.onChange}
														options={members}
														placeholder="Select Member"
														selected={field.value}
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
														selected={field.value}
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
									Send Notification
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
