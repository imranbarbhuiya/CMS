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
	id: string;
	name: string;
	role: 'Team lead' | 'Sales' | 'Service' | 'Not Assigned';
}

interface Team extends Omit<components['schemas']['CreateTeamDto'], 'companyId'> {
	id: string;
	members: TeamMember[];
}

const roleOptions = ['Team lead', 'Sales', 'Service', 'Not Assigned'] as const;

const addMembersFormSchema = z.object({
	members: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			role: z.enum(['Team lead', 'Sales', 'Service', 'Not Assigned']),
		}),
	),
});

type AddMembersFormValues = z.infer<typeof addMembersFormSchema>;

interface AddMembersDialogProps {
	readonly existingMembers: TeamMember[];
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly onSubmit: (values: { members: { id: string; name: string; role: TeamMember['role'] }[] }) => void;
}

const AddMembersDialog = ({ isOpen, onClose, onSubmit, existingMembers }: AddMembersDialogProps) => {
	const form = useForm<AddMembersFormValues>({
		resolver: zodResolver(addMembersFormSchema),
		defaultValues: {
			members: [],
		},
	});

	const { data: token } = useToken();

	const { data: users = [] } = useQuery({
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
			users.map((user) => ({
				value: user.id.toString(),
				label: user.name,
			})),
		[users],
	);

	useEffect(() => {
		if (isOpen) form.reset({ members: existingMembers });
	}, [isOpen, existingMembers, form]);

	const handleMemberSelect = (selectedValues: string[]) => {
		const members = selectedValues.map((memberId) => {
			const existingMember = existingMembers.find((em) => em.id === memberId);
			if (existingMember) return existingMember;

			const member = availableMemberOptions.find((availableMember) => availableMember.value === memberId);
			return {
				id: memberId,
				name: member?.label ?? '',
				role: 'Not Assigned' as const,
			};
		});
		form.setValue('members', members);
	};

	const handleRoleChange = (memberId: string, newRole: TeamMember['role']) => {
		const currentMembers = form.getValues('members');
		const updatedMembers = currentMembers.map((member) =>
			member.id === memberId ? { ...member, role: newRole } : member,
		);
		form.setValue('members', updatedMembers);
	};

	const handleSubmit = (values: AddMembersFormValues) => {
		onSubmit(values);
		form.reset();
		onClose();
	};

	const handleRemoveMember = (memberId: string) => {
		const currentMembers = form.getValues('members');
		const updatedMembers = currentMembers.filter((member) => member.id !== memberId);
		form.setValue('members', updatedMembers);
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog onOpenChange={handleClose} open={isOpen}>
			<DialogContent className="w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl font-semibold text-themecolor-600">Add Members</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-4 pb-4" onSubmit={form.handleSubmit(handleSubmit)}>
						<FormField
							control={form.control}
							name="members"
							render={() => (
								<FormItem>
									<FormLabel>Select Members</FormLabel>
									<FormControl>
										<MultiSelect
											onChange={handleMemberSelect}
											options={availableMemberOptions}
											placeholder="Select members"
											selected={form.getValues('members').map((member) => member.id)}
											showBadge={false}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{form.watch('members').length > 0 && (
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
										{form.watch('members').map((member) => (
											<TableRow key={member.id}>
												<TableCell>{member.name}</TableCell>
												<TableCell>
													<Select
														defaultValue={member.role}
														onValueChange={(value: TeamMember['role']) => handleRoleChange(member.id, value)}
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
														onClick={() => handleRemoveMember(member.id)}
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
							disabled={form.watch('members').length === 0}
							type="submit"
						>
							Add members to the team
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
	const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
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
			const previousTeams = queryClient.getQueryData<Team[]>(['/teams']) ?? [];

			const newTeamData = {
				...newTeam,
				id: Date.now().toString(),
				members: [],
			};

			queryClient.setQueryData<Team[]>(['/teams'], (old = []) => [...old, newTeamData]);

			return { previousTeams };
		},
		onError: (err, _newTeam, context) => {
			console.error('Failed to add team:', err);
			queryClient.setQueryData(['/teams'], context?.previousTeams);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/teams'] }),
	});

	const { mutate: updateTeamMembers } = useMutation({
		mutationFn: async ({ teamId, members }: { members: TeamMember[]; teamId: string }) => {
			const { data, error } = await Api.PATCH(`/teams/{id}`, {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					path: { id: teamId },
				},
				body: {
					users: members.map((member) => ({
						userId: member.id,
						role:
							member.role === 'Team lead'
								? 'Team Lead'
								: member.role === 'Sales'
									? 'Sales Executive'
									: 'Service Executive',
						companyId: 'Blue Company',
					})),
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		onMutate: async ({ teamId, members }) => {
			await queryClient.cancelQueries({ queryKey: ['/teams'] });
			const previousTeams = queryClient.getQueryData<Team[]>(['/teams']) ?? [];

			queryClient.setQueryData<Team[]>(['/teams'], (old = []) =>
				old.map((team) => (team.id === teamId ? { ...team, members } : team)),
			);

			return { previousTeams };
		},
		onError: (err, _variables, context) => {
			console.error('Failed to update team members:', err);
			queryClient.setQueryData(['/teams'], context?.previousTeams);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/teams'] }),
	});

	const handleCreateTeam = (data: TeamFormValues) => {
		addTeam(data);
		teamForm.reset();
		setIsCreateModalOpen(false);
	};

	const handleAddMembersSubmit = (values: { members: TeamMember[] }) => {
		if (!selectedTeamId) return;
		updateTeamMembers({ teamId: selectedTeamId, members: values.members });
		setIsAddMembersModalOpen(false);
	};

	const filteredTeams = useMemo(() => {
		const query = searchQuery.toLowerCase();
		return teams.filter(
			(team) =>
				team.name.toLowerCase().includes(query) ||
				team.description.toLowerCase().includes(query) ||
				team.members.some(
					(member) => member.name.toLowerCase().includes(query) || member.role.toLowerCase().includes(query),
				),
		);
	}, [teams, searchQuery]);

	const selectedTeam = useMemo(() => teams.find((team) => team.id === selectedTeamId), [teams, selectedTeamId]);

	const handleAddMembers = (teamId: string) => {
		setSelectedTeamId(teamId);
		setIsAddMembersModalOpen(true);
	};

	const handleSearch = () => {
		// Search query is already being handled by filteredTeams memo
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
					{teams.length === 0 ? (
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
								<Button size="sm" variant="outline">
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
													Team Members: {team.members.length || 'None'}
												</p>
												{team.members.length > 0 && (
													<div className="flex -space-x-2">
														{team.members.slice(0, 3).map((member) => (
															<Avatar className="border-2 border-background" key={member.id}>
																<AvatarFallback className="bg-muted">{getInitials(member.name)}</AvatarFallback>
															</Avatar>
														))}
														{team.members.length > 3 && (
															<Badge className="ml-2 rounded-full" variant="secondary">
																+{team.members.length - 3}
															</Badge>
														)}
													</div>
												)}
												<Button
													className="bg-themecolor-600 hover:bg-themecolor-500"
													onClick={() => handleAddMembers(team.id)}
												>
													Add Members
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
					<AddMembersDialog
						existingMembers={selectedTeam?.members ?? []}
						isOpen={isAddMembersModalOpen}
						onClose={() => {
							setIsAddMembersModalOpen(false);
							setSelectedTeamId(null);
						}}
						onSubmit={handleAddMembersSubmit}
					/>
				</>
			)}
		</div>
	);
};

export default TeamsPage;
