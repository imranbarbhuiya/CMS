'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
	members: z.array(z.string()).min(1, 'Please select at least one member'),
	teams: z.array(z.string()).min(1, 'Please select at least one team'),
	message: z.string().min(1, 'Message is required'),
});

// Mock data - replace with actual data from your API
const members = [
	{ value: '1', label: 'John Doe' },
	{ value: '2', label: 'Jane Smith' },
];

const teams = [
	{ value: '1', label: 'Development' },
	{ value: '2', label: 'Design' },
];

export default function AnnouncementPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			members: [],
			teams: [],
			message: '',
		},
	});

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		console.log(values);
		// Handle form submission here
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
						<form className="space-y-4 p-4" onSubmit={form.handleSubmit(handleSubmit)}>
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
												options={teams}
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
								<Button className="w-full bg-blue-500 hover:bg-blue-600" type="submit">
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
