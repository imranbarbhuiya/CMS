'use client';

import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ArrowDownUp } from 'lucide-react';
import { useState } from 'react';

import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import type { ColumnDef, SortingState } from '@tanstack/react-table';

type Status = (typeof statusOptions)[number];

interface Lead {
	email: string;
	id: number;
	leadId: string;
	mobile: string;
	name: string;
	status: Status;
}

const leads: Lead[] = [
	{
		id: 1,
		name: 'Emily Carter',
		email: 'emily.carter@example.com',
		mobile: '+ 1 299839893',
		leadId: '#21231',
		status: 'Status',
	},
	{
		id: 2,
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		mobile: '23445636454',
		leadId: '#21232',
		status: 'Status',
	},
	{
		id: 3,
		name: 'ames Henderson',
		email: 'ames@gmail.com',
		mobile: '2365345445',
		leadId: '#21233',
		status: 'Not Interested',
	},
	{
		id: 4,
		name: 'Priya Sharma',
		email: 'priya.sharma@email.com',
		mobile: '76535647645',
		leadId: '#21234',
		status: 'Voice Mial',
	},
	{
		id: 5,
		name: 'Emily Carter',
		email: 'emily.carter@example.com',
		mobile: '6754367657536',
		leadId: '#21235',
		status: 'Not Reachable',
	},
	{
		id: 6,
		name: 'Michael Nguyen',
		email: 'michael.nguyen@mail.com',
		mobile: '76575357377',
		leadId: '#21236',
		status: 'Duplicate lead',
	},
	{
		id: 7,
		name: 'ames Henderson',
		email: 'ames@gmail.com',
		mobile: '567373737',
		leadId: '#21237',
		status: 'Sale Done',
	},
	{
		id: 8,
		name: 'Sofia Martinez',
		email: 'sofia@gmail.com',
		mobile: '7889463455',
		leadId: '#21238',
		status: 'Payment Pending',
	},
	{
		id: 9,
		name: 'Sofia Martinez',
		email: 'sofia@gmail.com',
		mobile: '335464577866',
		leadId: '#21239',
		status: 'Invalid Lead',
	},
	{
		id: 10,
		name: 'Michael Nguyen',
		email: 'michael.nguyen@mail.com',
		mobile: '92787463782',
		leadId: '#21240',
		status: 'Status',
	},
];

const statusOptions = [
	'Status',
	'Not Interested',
	'Voice Mial',
	'Not Reachable',
	'Duplicate lead',
	'Sale Done',
	'Payment Pending',
	'Invalid Lead',
] as const;

const columns: ColumnDef<Lead>[] = [
	{
		accessorKey: 'id',
		header: 'Sr. No',
		size: 60,
		enableSorting: true,
	},
	{
		accessorKey: 'name',
		header: 'Customer Name',
		enableSorting: true,
	},
	{
		accessorKey: 'email',
		header: 'Email Address',
		enableSorting: true,
	},
	{
		accessorKey: 'mobile',
		header: 'Mobile Number',
		enableSorting: true,
	},
	{
		accessorKey: 'leadId',
		header: 'Lead ID',
		enableSorting: true,
	},
	{
		accessorKey: 'status',
		header: 'Disposition',
		enableSorting: true,
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<Select defaultValue={status}>
					<SelectTrigger className="w-[140px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{statusOptions.map((option) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		},
	},
	{
		id: 'actions',
		header: 'Raise Ticket',
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<Button
					className={
						status === 'Sale Done' || status === 'Payment Pending'
							? 'bg-themecolor-600 text-white hover:bg-themecolor-700'
							: 'text-gray-500'
					}
					variant="ghost"
				>
					Raise Ticket
				</Button>
			);
		},
	},
];

export function LeadsTable() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const table = useReactTable({
		data: leads,
		columns,
		state: {
			sorting,
			pagination: {
				pageIndex: currentPage - 1,
				pageSize: itemsPerPage,
			},
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		pageCount: Math.ceil(leads.length / itemsPerPage),
	});

	return (
		<div className="w-full">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} style={{ width: header.getSize() }}>
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
