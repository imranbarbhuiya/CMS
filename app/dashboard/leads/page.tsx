'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Search, ArrowDownUp } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';

import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import emptyImage from './empty.png';

import type { ColumnDef, SortingState } from '@tanstack/react-table';

interface Lead {
	email: string;
	id: number;
	leadId: string;
	mobile: string;
	name: string;
	status: Status;
}

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

type Status = (typeof statusOptions)[number];

const updateLeadStatus = async (leadId: number, status: Status): Promise<Lead> => {
	void new Promise((resolve) => {
		setTimeout(resolve, 500);
	});
	return { leadId: `#${leadId}`, id: leadId, status } as Lead;
};

const fetchLeads = (): Lead[] => [
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

export default function LeadsPage() {
	const { data: leads = [] } = useQuery({
		queryKey: ['leads'],
		queryFn: fetchLeads,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [searchTerm, setSearchTerm] = useState('');

	const queryClient = useQueryClient();

	const filteredLeads = useMemo(() => {
		const term = searchTerm.toLowerCase();
		return leads.filter(
			(lead) =>
				lead.name.toLowerCase().includes(term) ||
				lead.email.toLowerCase().includes(term) ||
				lead.mobile.toLowerCase().includes(term) ||
				lead.leadId.toLowerCase().includes(term),
		);
	}, [leads, searchTerm]);

	const { mutate: updateStatus } = useMutation({
		mutationFn: ({ leadId, status }: { leadId: number; status: Status }) => updateLeadStatus(leadId, status),
		// When mutate is called:
		onMutate: async ({ leadId, status }) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['leads'] });

			// Snapshot the previous value
			const previousLeads = queryClient.getQueryData<Lead[]>(['leads']);

			// Optimistically update to the new value
			queryClient.setQueryData<Lead[]>(['leads'], (old) =>
				old?.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)),
			);

			// Return a context object with the snapshotted value
			return { previousLeads };
		},
		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (_, __, context) => {
			if (context?.previousLeads) queryClient.setQueryData<Lead[]>(['leads'], context.previousLeads);
		},
		// onSettled: () => {
		// 	void queryClient.invalidateQueries({ queryKey: ['leads'] });
		// },
	});

	const columns: ColumnDef<Lead>[] = useMemo(
		() => [
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
					const { status, id } = row.original;
					return (
						<Select
							defaultValue={status}
							onValueChange={(value: Status) => updateStatus({ leadId: id, status: value })}
						>
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
									? 'bg-themecolor-600 text-white hover:bg-themecolor-700 hover:text-white'
									: 'text-gray-500'
							}
							variant="ghost"
						>
							Raise Ticket
						</Button>
					);
				},
			},
		],
		[updateStatus],
	);

	const table = useReactTable({
		data: filteredLeads,
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
		pageCount: Math.ceil(filteredLeads.length / itemsPerPage),
	});
	const handleSearch = () => {
		setSearchTerm(searchInputRef.current?.value ?? '');
		setCurrentPage(1);
	};

	return (
		<div className="space-y-4 p-3 md:p-8">
			<div className="flex items-center justify-start">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Leads</h1>
			</div>
			<div className="flex items-center gap-2">
				<Input
					className="h-9 max-w-sm"
					onKeyDown={(ev) => {
						if (ev.key === 'Enter') handleSearch();
					}}
					placeholder="Search lead using name, email"
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
			{leads.length ? (
				<div className="rounded-md border">
					<div className="w-full">
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => (
												<TableHead key={header.id} style={{ width: header.getSize() }}>
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
			) : (
				<div className="flex flex-col items-center justify-center gap-1.5 pt-20">
					<Image alt="empty" src={emptyImage} />
					<p className="text-2xl font-medium leading-8 tracking-[-0.6px] text-primary">No Leads at the Moment</p>
				</div>
			)}
		</div>
	);
}
