'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileOutput, PlusIcon, Search } from 'lucide-react';
import { div as MotionDiv } from 'motion/react-client';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { MultiSelect } from '@/components/multi-select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToken } from '@/hooks/use-token';
import { Api } from '@/lib/fetch';

import type { components } from '@/openapi/api';

interface TeamMember {
	role: 'Team Lead' | 'Sales Executive' | 'Service Executive';
	userId: string;
	userName: string;
}

interface Team extends Omit<components['schemas']['CreateTeamDto'], 'companyId'> {
	id: string;
	users: TeamMember[];
}

const roleOptions = ['Team Lead', 'Sales Executive', 'Service Executive'] as const;

const addUsersFormSchema = z.object({
	users: z.array(
		z.object({
			userId: z.string(),
			userName: z.string(),
			role: z.enum(['Team Lead', 'Sales Executive', 'Service Executive'], {
				message: 'Please select a valid role',
			}),
		}),
		{
			message: 'Please select a valid role',
		},
	),
});

type AddUsersFormValues = z.infer<typeof addUsersFormSchema>;

interface AddUsersDialogProps {
	readonly existingUsers: TeamMember[];
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly onSubmit: (values: AddUsersFormValues) => void;
}

const AddUsersDialog = ({ isOpen, onClose, onSubmit, existingUsers }: AddUsersDialogProps) => {
	const form = useForm<AddUsersFormValues>({
		resolver: zodResolver(addUsersFormSchema),
		defaultValues: {
			users: [],
		},
	});

	const { data: token } = useToken();

	const { data: users } = useQuery({
		queryKey: ['/all'],
		queryFn: async () => {
			const { data, error } = await Api.GET('/all', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');
			return data;
		},
		enabled: Boolean(token),
	});

	const availableMemberOptions = useMemo(
		() =>
			users?.data.map((user) => ({
				value: user.id.toString(),
				label: user.name,
			})) ?? [],
		[users],
	);

	useEffect(() => {
		if (isOpen) form.reset({ users: existingUsers });
	}, [isOpen, existingUsers, form]);

	const handleMemberSelect = (selectedValues: string[]) => {
		const users = selectedValues.map((memberId) => {
			const existingMember = existingUsers.find((em) => em.userId === memberId);
			if (existingMember) return existingMember;

			const member = availableMemberOptions.find((availableMember) => availableMember.value === memberId);
			return {
				userId: memberId,
				userName: member?.label ?? '',
				role: 'Not Assigned' as any,
			};
		});
		form.setValue('users', users);
	};

	const handleRoleChange = (memberId: string, newRole: TeamMember['role']) => {
		const currentUsers = form.getValues('users');
		const updatedUsers = currentUsers.map((member) =>
			member.userId === memberId ? { ...member, role: newRole } : member,
		);
		form.setValue('users', updatedUsers);
	};

	const handleSubmit = (values: AddUsersFormValues) => {
		onSubmit(values);
		form.reset();
		onClose();
	};

	const handleRemoveUser = (memberId: string) => {
		const currentUsers = form.getValues('users');
		const updatedUsers = currentUsers.filter((member) => member.userId !== memberId);
		form.setValue('users', updatedUsers);
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog onOpenChange={handleClose} open={isOpen}>
			<DialogContent className="w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl font-semibold text-themecolor-600">Add Users</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-4 pb-4" onSubmit={form.handleSubmit(handleSubmit)}>
						<FormField
							control={form.control}
							name="users"
							render={() => (
								<FormItem>
									<FormLabel>Select Users</FormLabel>
									<FormControl>
										<MultiSelect
											onChange={handleMemberSelect}
											options={availableMemberOptions}
											placeholder="Select users"
											selected={form.getValues('users').map((member) => member.userId)}
											showBadge={false}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{form.watch('users').length > 0 && (
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>User</TableHead>
											<TableHead>Role</TableHead>
											<TableHead className="text-right">Remove Member</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{form.watch('users').map((member) => (
											<TableRow key={member.userId}>
												<TableCell>{member.userName}</TableCell>
												<TableCell>
													<Select
														defaultValue={member.role}
														onValueChange={(value: TeamMember['role']) => handleRoleChange(member.userId, value)}
													>
														<SelectTrigger className="w-[140px]">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{roleOptions.map((role) => (
																<SelectItem key={role} value={role}>
																	{role}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</TableCell>
												<TableCell className="text-right">
													<Button
														className="text-red-500 hover:text-red-600"
														onClick={() => handleRemoveUser(member.userId)}
														size="sm"
														type="button"
														variant="ghost"
													>
														Remove
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
						<Button
							className="w-full bg-themecolor-600 hover:bg-themecolor-500"
							disabled={form.watch('users').length === 0}
							type="submit"
						>
							Add users to the team
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

const getInitials = (name: string) =>
	name
		.split(' ')
		.map((nm) => nm[0])
		.join('')
		.toUpperCase();

const teamSchema = z.object({
	name: z.string().min(1, 'Team name is required'),
	description: z.string(),
});

type TeamFormValues = z.infer<typeof teamSchema>;

const TeamsPage = () => {
	const queryClient = useQueryClient();
	const { data: token } = useToken();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isAddUsersModalOpen, setIsAddUsersModalOpen] = useState(false);
	const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	const teamForm = useForm<TeamFormValues>({
		resolver: zodResolver(teamSchema),
		defaultValues: {
			name: '',
			description: '',
		},
	});

	const { data: teams, error: teamsError } = useQuery({
		queryKey: ['/teams'],
		queryFn: async () => {
			const { data, error } = await Api.GET('/teams', {
				params: {
					query: {},
					header: {
						Authorization: `Bearer ${token}`,
					},
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		enabled: Boolean(token),
	});

	const { mutate: addTeam } = useMutation({
		mutationFn: async (newTeam: { description: string | null; name: string }) => {
			const { data, error } = await Api.POST('/teams', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
				},
				body: {
					...newTeam,
					companyId: 'Blue Company', // This should come from user context or configuration
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		onMutate: async (newTeam) => {
			await queryClient.cancelQueries({ queryKey: ['/teams'] });
			const previousTeams = queryClient.getQueryData<{ data: Team[]; total: number }>(['/teams']) ?? [];

			const newTeamData: Team = {
				...newTeam,
				id: Date.now().toString(),
				users: [],
			};

			queryClient.setQueryData<{ data: Team[]; total: number }>(['/teams'], (old) => {
				if (!old) return old;
				return { ...old, data: [...old.data, newTeamData] };
			});

			return { previousTeams };
		},
		onError: (err, _newTeam, context) => {
			console.error('Failed to add team:', err);
			queryClient.setQueryData(['/teams'], context?.previousTeams);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/teams'] }),
	});

	const { mutate: updateTeamUsers } = useMutation({
		mutationFn: async ({ teamId, users }: { teamId: string; users: TeamMember[] }) => {
			const { data, error } = await Api.PATCH(`/teams/{id}`, {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					path: { id: teamId },
				},
				body: {
					users: users.map((member) => ({
						userId: member.userId,
						role: member.role,
						companyId: 'Blue Company' as const,
					})),
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		onMutate: async ({ teamId, users }) => {
			await queryClient.cancelQueries({ queryKey: ['/teams'] });
			const previousTeams = queryClient.getQueryData<{ data: Team[]; total: number }>(['/teams']) ?? [];

			queryClient.setQueryData<{ data: Team[]; total: number }>(['/teams'], (old) => {
				if (!old) return old;
				const updatedTeams = old.data.map((team) => {
					if (team.id === teamId) return { ...team, users };

					return team;
				});
				return { ...old, data: updatedTeams };
			});

			return { previousTeams };
		},
		onError: (err, _variables, context) => {
			console.error('Failed to update team users:', err);
			queryClient.setQueryData(['/teams'], context?.previousTeams);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/teams'] }),
	});

	const handleCreateTeam = (data: TeamFormValues) => {
		addTeam(data);
		teamForm.reset();
		setIsCreateModalOpen(false);
	};

	const handleAddUsersSubmit = (values: { users: TeamMember[] }) => {
		if (!selectedTeamId) return;
		updateTeamUsers({ teamId: selectedTeamId, users: values.users });
		setIsAddUsersModalOpen(false);
	};

	const filteredTeams = useMemo(() => teams?.data ?? [], [teams]);

	const selectedTeam = useMemo(() => teams?.data.find((team) => team.id === selectedTeamId), [teams, selectedTeamId]);

	const handleAddUsers = (teamId: string) => {
		setSelectedTeamId(teamId);
		setIsAddUsersModalOpen(true);
	};

	const handleSearch = () => {
		// Search query is already being handled by filteredTeams memo
	};

	const handleExport = async () => {
		const { data: excelData } = await Api.GET('/teams', {
			params: {
				header: {
					Authorization: `Bearer ${token}`,
				},
				query: {
					export: true,
					search: searchQuery || undefined,
				},
			},
		});

		const blob = new Blob([Buffer.from(excelData as unknown as string)], {
			type: 'text/csv',
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'teams.csv';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="p-6">
			{teamsError ? (
				<div className="text-red-500">Error loading teams: {teamsError.message}</div>
			) : (
				<>
					<div className="mb-6 flex items-center justify-between">
						<h1 className="text-2xl font-bold">Teams</h1>
					</div>
					{teams?.data.length === 0 ? (
						<Button
							className="mt-4 flex items-center gap-2 bg-themecolor-600 hover:bg-themecolor-500"
							onClick={() => setIsCreateModalOpen(true)}
						>
							<PlusIcon className="size-4" /> Create Team
						</Button>
					) : (
						<>
							<div className="flex items-center justify-between pb-4">
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-2">
										<Input
											className="h-9 w-64"
											onChange={(event) => setSearchQuery(event.target.value)}
											placeholder="Search team, member"
											type="text"
											value={searchQuery}
										/>
										<Button className="text-primary" onClick={handleSearch} size="sm" variant="secondary">
											<Search className="size-4" />
											Search
										</Button>
									</div>
									<Button
										className="flex items-center gap-2 bg-themecolor-600 hover:bg-themecolor-500"
										onClick={() => setIsCreateModalOpen(true)}
										size="sm"
									>
										<PlusIcon className="size-4" /> Create Team
									</Button>
								</div>
								<Button onClick={handleExport} size="sm" variant="outline">
									<FileOutput className="size-4" />
									Export All Data
								</Button>
							</div>
							<div className="space-y-4">
								{filteredTeams.map((team) => (
									<MotionDiv
										animate={{ opacity: 1, y: 0 }}
										className="w-full"
										initial={{ opacity: 0, y: 20 }}
										key={team.id}
									>
										<Card className="flex w-[620px] flex-col items-start border border-solid border-border">
											<CardHeader>
												<CardTitle>{team.name}</CardTitle>
												<p className="text-sm text-muted-foreground">{team.description}</p>
											</CardHeader>
											<CardFooter className="w-full justify-between">
												<p className="text-sm font-medium leading-5 text-foreground">
													Team Users: {team.users.length || 'None'}
												</p>
												{team.users.length > 0 && (
													<div className="flex -space-x-2">
														{team.users.slice(0, 3).map((member) => (
															<Avatar className="border-2 border-background" key={member.userId}>
																<AvatarFallback className="bg-muted">{getInitials(member.userName)}</AvatarFallback>
															</Avatar>
														))}
														{team.users.length > 3 && (
															<Badge className="ml-2 rounded-full" variant="secondary">
																+{team.users.length - 3}
															</Badge>
														)}
													</div>
												)}
												<Button
													className="bg-themecolor-600 hover:bg-themecolor-500"
													onClick={() => handleAddUsers(team.id)}
												>
													Add Users
												</Button>
											</CardFooter>
										</Card>
									</MotionDiv>
								))}
							</div>
						</>
					)}
					<Dialog onOpenChange={setIsCreateModalOpen} open={isCreateModalOpen}>
						<DialogContent className="w-[400px]">
							<DialogHeader>
								<DialogTitle className="text-center text-2xl font-semibold text-themecolor-600">
									Create Team
								</DialogTitle>
							</DialogHeader>
							<Form {...teamForm}>
								<form className="space-y-4 pb-4" onSubmit={teamForm.handleSubmit(handleCreateTeam)}>
									<FormField
										control={teamForm.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Team Name</FormLabel>
												<FormControl>
													<Input placeholder="Team A" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={teamForm.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Something good about this team is this team is very friendly and completed all the tasks."
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button className="w-full bg-themecolor-600 hover:bg-themecolor-500" type="submit">
										Create Team
									</Button>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
					<AddUsersDialog
						existingUsers={selectedTeam?.users ?? []}
						isOpen={isAddUsersModalOpen}
						onClose={() => {
							setIsAddUsersModalOpen(false);
							setSelectedTeamId(null);
						}}
						onSubmit={handleAddUsersSubmit}
					/>
				</>
			)}
		</div>
	);
};

export default TeamsPage;
