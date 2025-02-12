'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface User {
	id: string;
	name: string;
}

interface Team {
	id: string;
	name: string;
}

const formSchema = z.object({
	members: z.array(z.string()).min(1, 'Please select at least one member'),
	teams: z.array(z.string()).min(1, 'Please select at least one team'),
	message: z.string().min(1, 'Message is required'),
});

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
			members: [],
			teams: [],
			message: '',
		},
	});

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		toast.message(values.message, {
			closeButton: true,
		});
	};

	const handleMembersChange = (values: string[]) => {
		form.setValue('members', values);
	};

	const handleTeamsChange = (values: string[]) => {
		form.setValue('teams', values);
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
								name="members"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Member</FormLabel>
										<FormControl>
											<MultiSelect
												onChange={handleMembersChange}
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
												onChange={handleTeamsChange}
												options={teamOptions}
												placeholder="Select Team"
												selected={field.value}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
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
