'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	ArrowBigUpDash,
	ArrowDownUp,
	MoreHorizontal,
	Pencil,
	Trash2,
	FileOutput,
	Search,
	Copy,
	KeyRound,
	Plus,
} from 'lucide-react';
import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import type { ColumnDef, SortingState } from '@tanstack/react-table';

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

const fetchUsers = (): User[] => [
	{
		id: 1,
		name: 'Emily Carter',
		email: 'ken99@yahoo.com',
		teamName: 'Team A',
		teamRole: 'Team Lead',
	},
	{
		id: 2,
		name: 'Priya Sharma',
		email: 'abe45@gmail.com',
		teamName: 'Team A',
		teamRole: 'Sales',
	},
	{
		id: 3,
		name: 'Emily Carter 3',
		email: 'ken9@yahoo.com',
		teamName: 'Team A',
		teamRole: 'Sales',
	},
	{
		id: 4,
		name: 'Priya Sharma 2',
		email: 'abe55@gmail.com',
		teamName: 'Team A',
		teamRole: 'Service',
	},
	{
		id: 5,
		name: 'Ames Henderson',
		email: 'montserrat44@gmail.com',
		teamName: 'Team B',
		teamRole: 'Team Lead',
	},
	{
		id: 6,
		name: 'Ames Henderson 2',
		email: 'montserrat45@gmail.com',
		teamName: 'Team B',
		teamRole: 'Sales',
	},
	{
		id: 7,
		name: 'Emily Carter 1',
		email: 'em2@yahoo.com',
		teamName: 'Team B',
		teamRole: 'Service',
	},
	{
		id: 8,
		name: 'Ames Henderson',
		email: 'montserrat44@gmail.com',
		teamName: 'Team B',
		teamRole: 'Sales',
	},
	{
		id: 9,
		name: 'Michael Nguyen',
		email: 'montserrat44@gmail.com',
		teamName: 'Not Assigned',
		teamRole: 'Not Assigned',
	},
];

export default function ManageUserPage() {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);

	const handleDeleteUser = (user: User) => {
		setUserToDelete(user);
		setDeleteConfirmOpen(true);
	};

	const { data: users = [] } = useQuery({
		queryKey: ['users'],
		queryFn: fetchUsers,
	});

	const { mutate: addUser } = useMutation({
		mutationFn: async (newUser: User) => {
			try {
				// This would be replaced with an actual API call
				return await Promise.resolve(newUser);
			} catch (error) {
				console.error('Failed to add user:', error);
				throw error;
			}
		},
		onMutate: async (newUser) => {
			try {
				// Cancel any outgoing refetches
				await queryClient.cancelQueries({ queryKey: ['users'] });

				// Snapshot the previous value
				const previousUsers = queryClient.getQueryData<User[]>(['users']) ?? [];

				// Optimistically update to the new value
				queryClient.setQueryData<User[]>(['users'], (old = []) => [...old, newUser]);

				// Return a context object with the snapshotted value
				return { previousUsers };
			} catch (error) {
				console.error('Failed to prepare mutation:', error);
				throw error;
			}
		},
		onError: (err, _newUser, context) => {
			console.error('Failed to add user:', err);
			// If the mutation fails, use the context returned from onMutate to roll back
			queryClient.setQueryData(['users'], context?.previousUsers);
		},
		// onSettled: async () => {
		// 	await queryClient.invalidateQueries({ queryKey: ['users'] });
		// },
	});

	const { mutate: updateUser } = useMutation({
		mutationFn: async (updatedUser: User) => {
			try {
				// This would be replaced with an actual API call
				return await Promise.resolve(updatedUser);
			} catch (error) {
				console.error('Failed to update user:', error);
				throw error;
			}
		},
		onMutate: async (updatedUser) => {
			try {
				await queryClient.cancelQueries({ queryKey: ['users'] });
				const previousUsers = queryClient.getQueryData<User[]>(['users']) ?? [];

				queryClient.setQueryData<User[]>(['users'], (old = []) =>
					old.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
				);

				return { previousUsers };
			} catch (error) {
				console.error('Failed to prepare mutation:', error);
				throw error;
			}
		},
		onError: (err, _updatedUser, context) => {
			console.error('Failed to update user:', err);
			queryClient.setQueryData(['users'], context?.previousUsers);
		},
	});

	const { mutate: deleteUser } = useMutation({
		mutationFn: async (userId: number) => {
			try {
				// This would be replaced with an actual API call
				return await Promise.resolve(userId);
			} catch (error) {
				console.error('Failed to delete user:', error);
				throw error;
			}
		},
		onMutate: async (userId) => {
			try {
				await queryClient.cancelQueries({ queryKey: ['users'] });
				const previousUsers = queryClient.getQueryData<User[]>(['users']) ?? [];

				queryClient.setQueryData<User[]>(['users'], (old = []) => old.filter((user) => user.id !== userId));

				return { previousUsers };
			} catch (error) {
				console.error('Failed to prepare mutation:', error);
				throw error;
			}
		},
		onError: (err, _userId, context) => {
			console.error('Failed to delete user:', err);
			queryClient.setQueryData(['users'], context?.previousUsers);
			toast.error('Failed to delete user');
		},
		onSuccess: () => {
			toast.success('User deleted successfully');
		},
	});

	const manageUserForm = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	const generatePassword = useCallback(() => {
		const length = 12;
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
		let password = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length);
			password += charset[randomIndex];
		}
		manageUserForm.setValue('password', password);
	}, [manageUserForm]);

	const handleCopyPassword = useCallback(() => {
		void navigator.clipboard.writeText(manageUserForm.getValues('password'));
		toast('Password copied to clipboard');
	}, [manageUserForm]);

	const onSubmit = (data: UserFormValues) => {
		if (isEdit && user) {
			const updatedUser = {
				...user,
				...data,
			};
			updateUser(updatedUser);
		} else {
			const newUser = {
				...data,
				id: Math.floor(Math.random() * 1_000),
				teamName: 'Not Assigned',
				teamRole: 'Not Assigned',
			};
			addUser(newUser);
		}
		setOpen(false);
		manageUserForm.reset();
	};

	const columns: ColumnDef<User>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
				/>
			),
			cell: ({ row }) => (
				<Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(Boolean(value))} />
			),
			enableSorting: false,
		},
		{
			accessorKey: 'name',
			header: 'Name',
			enableSorting: true,
		},
		{
			accessorKey: 'email',
			header: 'Email',
			enableSorting: true,
		},
		{
			accessorKey: 'teamName',
			header: 'Team Name',
			enableSorting: true,
		},
		{
			accessorKey: 'teamRole',
			header: 'Team Role',
			enableSorting: true,
		},
		{
			id: 'actions',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="size-8 p-0" variant="ghost">
							<MoreHorizontal className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => {
								setIsEdit(true);
								setUser(row.original);
								setOpen(true);

								manageUserForm.reset({
									name: row.original.name,
									email: row.original.email,
									password: '',
								});
							}}
						>
							<span className="flex w-full items-center gap-2">
								<Pencil className="size-4" />
								Edit
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<span className="flex items-center gap-2">
								<ArrowBigUpDash className="size-4" />
								Appoint Manager
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(row.original)}>
							<span className="flex items-center gap-2">
								<Trash2 className="size-4" />
								Delete
							</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	const handleExport = () => {
		const jsonString = JSON.stringify(users, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'users.json';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const [sorting, setSorting] = useState<SortingState>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [rowSelection, setRowSelection] = useState({});
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [searchTerm, setSearchTerm] = useState('');

	const filteredUsers = useMemo(() => {
		const term = searchTerm.toLowerCase();
		return users.filter(
			(user) =>
				user.name.toLowerCase().includes(term) ||
				user.email.toLowerCase().includes(term) ||
				user.teamName.toLowerCase().includes(term) ||
				user.teamRole.toLowerCase().includes(term),
		);
	}, [users, searchTerm]);

	const handleSearch = () => {
		setSearchTerm(searchInputRef.current?.value ?? '');
		setCurrentPage(1);
	};

	useEffect(() => {
		if (!open) {
			setIsEdit(false);
			setUser(null);
			manageUserForm.reset();
		}
	}, [open, manageUserForm]);

	const table = useReactTable({
		data: filteredUsers,
		columns,
		state: {
			sorting,
			rowSelection,
			pagination: {
				pageIndex: currentPage - 1,
				pageSize: itemsPerPage,
			},
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		pageCount: Math.ceil(filteredUsers.length / itemsPerPage),
	});

	return (
		<div className="space-y-4 p-3 md:p-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Manage User</h1>
			</div>
			<div className="flex flex-col-reverse items-start justify-between md:flex-row md:items-center">
				<div className="flex items-center gap-2">
					<Input
						className="max-w-sm"
						onKeyDown={(ev) => {
							if (ev.key === 'Enter') handleSearch();
						}}
						placeholder="Search user by name, email"
						ref={searchInputRef}
					/>
					<Button
						className="text-sm font-medium leading-6 text-primary"
						onClick={handleSearch}
						size="sm"
						variant="secondary"
					>
						<Search className="size-4" />
						Search
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Button className="gap-2" onClick={handleExport} variant="outline">
						<FileOutput className="size-4" />
						Export All Data
					</Button>
					<Button className="gap-2" onClick={() => setOpen(true)} variant="outline">
						<Plus className="size-4" />
						Add User
					</Button>
				</div>
			</div>
			<div className="rounded-md border">
				<div className="w-full">
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id}>
												<div className="flex items-center gap-1">
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
													{header.column.getCanSort() && (
														<Button
															className="flex items-center gap-1"
															onClick={header.column.getToggleSortingHandler()}
															size="icon"
															variant="ghost"
														>
															<ArrowDownUp className={header.column.getIsSorted() === 'asc' ? 'rotate-180' : ''} />
														</Button>
													)}
												</div>
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Pagination
						currentPage={currentPage}
						itemsPerPage={itemsPerPage}
						onItemsPerPageChange={(value) => {
							setItemsPerPage(value);
							setCurrentPage(1);
						}}
						onPageChange={setCurrentPage}
						totalPages={table.getPageCount()}
					/>
				</div>
			</div>
			<Dialog onOpenChange={setOpen} open={open}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
					</DialogHeader>
					<Form {...manageUserForm}>
						<form className="space-y-4" onSubmit={manageUserForm.handleSubmit(onSubmit)}>
							<FormField
								control={manageUserForm.control}
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
								control={manageUserForm.control}
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
								control={manageUserForm.control}
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
			<Dialog onOpenChange={setDeleteConfirmOpen} open={deleteConfirmOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Delete User</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<p>Are you sure you want to delete this user? This action cannot be undone.</p>
						<div className="flex justify-end gap-2">
							<Button onClick={() => setDeleteConfirmOpen(false)} variant="outline">
								Cancel
							</Button>
							<Button
								onClick={() => {
									if (userToDelete) {
										deleteUser(userToDelete.id);
										setDeleteConfirmOpen(false);
										setUserToDelete(null);
									}
								}}
								variant="destructive"
							>
								Delete
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
