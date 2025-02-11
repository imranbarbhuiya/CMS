'use client';

import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ArrowBigUpDash, ArrowDownUp, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import type { ColumnDef, SortingState } from '@tanstack/react-table';

export interface User {
	email: string;
	id: number;
	name: string;
	teamName: string;
	teamRole: string;
}

export const users: User[] = [
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
		name: 'Emily Carter',
		email: 'ken99@yahoo.com',
		teamName: 'Team A',
		teamRole: 'Sales',
	},
	{
		id: 4,
		name: 'Priya Sharma',
		email: 'abe45@gmail.com',
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
		name: 'Ames Henderson',
		email: 'montserrat44@gmail.com',
		teamName: 'Team B',
		teamRole: 'Sales',
	},
	{
		id: 7,
		name: 'Emily Carter',
		email: 'ken99@yahoo.com',
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
		cell: () => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="size-8 p-0" variant="ghost">
						<MoreHorizontal className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem>
						<span className="flex items-center gap-2">
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
					<DropdownMenuItem className="text-destructive">
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

export function ManageUserTable() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable({
		data: users,
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
		pageCount: Math.ceil(users.length / itemsPerPage),
	});

	return (
		<div className="w-full">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										<div className="flex items-center gap-1">
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
	);
}
