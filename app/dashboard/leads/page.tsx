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
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useMemo, useRef, useState } from 'react';

import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToken } from '@/hooks/use-token';
import { Api } from '@/lib/fetch';

import { CreateLeadDialog } from './create-lead-dialog';
import { LeadEmptySvg } from './empty-svg';
import { LeadDialog } from './lead-dialog';

import { ForwardLeadDialog, type LeadDto } from '../tickets/ticket-dialog';

import type { ColumnDef, SortingState } from '@tanstack/react-table';

const statusOptions = [
	'New',
	'Customer Not Interested',
	'Voice Mail',
	'Not Reachable',
	'Duplicate Lead',
	'Sale Done',
	'Payment Pending',
] as const;

type Status = (typeof statusOptions)[number];

export default function LeadsPage() {
	const { data: token } = useToken();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [currentPage, setCurrentPage] = useQueryState('page', parseAsInteger.withDefault(1));
	const [itemsPerPage, setItemsPerPage] = useQueryState('items-count', parseAsInteger.withDefault(10));
	const [searchTerm, setSearchTerm] = useQueryState('search', parseAsString.withDefault(''));
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [selectedLead, setSelectedLead] = useState<LeadDto | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
	const [leadToForward, setLeadToForward] = useState<LeadDto | null>(null);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const { data, isFetched, error } = useQuery({
		queryKey: ['/leads', { currentPage, itemsPerPage, searchTerm }],
		queryFn: async ({ signal }) => {
			const { data, error } = await Api.GET('/leads', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					query: {
						search: searchTerm || undefined,
						page: currentPage,
						limit: itemsPerPage,
					},
				},
				signal,
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		enabled: Boolean(token),
	});

	const leads = useMemo(() => data?.data ?? [], [data]);
	const totalItems = data?.total ?? 0;
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const queryClient = useQueryClient();

	const { mutate: updateStatus } = useMutation({
		mutationFn: async ({ leadId, status }: { leadId: string; status: Status }) => {
			const { data, error } = await Api.PATCH(`/leads/{id}`, {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					path: { id: leadId },
				},
				body: { status },
			});

			if (error) throw new Error(error.message ?? 'An error occurred');
			return data;
		},
		onMutate: async ({ leadId, status }) => {
			await queryClient.cancelQueries({ queryKey: ['/leads'] });

			const previousLeads = queryClient.getQueryData<{ data: LeadDto[]; total: number }>([
				'/leads',
				{ currentPage, itemsPerPage, searchTerm },
			]);

			queryClient.setQueryData<{ data: LeadDto[]; total: number }>(
				['/leads', { currentPage, itemsPerPage, searchTerm }],
				(old) => {
					if (!old) return old;
					return {
						...old,
						data: old.data.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)),
					};
				},
			);

			return { previousLeads };
		},
		onError: (_, __, context) => {
			if (context?.previousLeads) {
				queryClient.setQueryData<{ data: LeadDto[]; total: number }>(
					['/leads', { currentPage, itemsPerPage, searchTerm }],
					context.previousLeads,
				);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['/leads'] });
		},
	});

	const { mutate: createLead, isPending: isCreatePending } = useMutation({
		mutationFn: async (formData: { email: string; name: string; phone: string }) => {
			const { data, error } = await Api.POST('/leads', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					query: {
						Company: 'Blue Company',
					},
				},
				body: {
					...formData,
					billingAddress: '',
					internalLeadId: '',
					leadSource: 'Blue Company',
					paymentMethod: '',
					subscription: '',
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');
			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['/leads'] });
			setIsCreateDialogOpen(false);
		},
	});

	const columns: ColumnDef<LeadDto>[] = useMemo(
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
				accessorKey: 'phone',
				header: 'Mobile Number',
				enableSorting: true,
			},
			{
				accessorKey: 'internalLeadId',
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
					const lead = row.original;
					const status = lead.status;
					return (
						<Button
							className={
								status === 'Sale Done' || status === 'Payment Pending'
									? 'bg-themecolor-600 text-white hover:bg-themecolor-700 hover:text-white'
									: 'text-gray-500'
							}
							onClick={(event: React.MouseEvent) => {
								event.stopPropagation();
								if (!['Sale Done', 'Payment Pending'].includes(status)) return;
								setLeadToForward(lead);
								setIsForwardDialogOpen(true);
							}}
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
		pageCount: totalPages,
	});

	const handleSearch = () => {
		void setSearchTerm(searchInputRef.current?.value ?? '');
		void setCurrentPage(1);
	};

	return (
		<div className="space-y-4 p-3 md:p-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Leads</h1>
				<Button
					className="bg-themecolor-600 hover:bg-themecolor-500"
					disabled
					onClick={() => setIsCreateDialogOpen(true)}
				>
					Create Lead
				</Button>
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
			{isFetched ? (
				leads.length ? (
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
											<TableRow
												className="cursor-pointer"
												key={row.id}
												onClick={() => {
													setSelectedLead(row.original);
													setIsDialogOpen(true);
												}}
											>
												{row.getVisibleCells().map((cell) => (
													<TableCell key={cell.id}>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</TableCell>
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
									void setItemsPerPage(value);
									void setCurrentPage(1);
								}}
								onPageChange={setCurrentPage}
								totalPages={totalPages}
							/>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-1.5 pt-20 text-[#2563EB] [&:is(.rose_*)]:text-[#E11D48]">
						<LeadEmptySvg />
						<p className="text-2xl font-medium leading-8 tracking-[-0.6px] text-primary">
							{error ? error.message : 'No Leads at the Moment'}
						</p>
					</div>
				)
			) : (
				<div className="flex items-center justify-center pt-20">
					<div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
				</div>
			)}
			{selectedLead && <LeadDialog lead={selectedLead} onOpenChange={setIsDialogOpen} open={isDialogOpen} />}
			{leadToForward && (
				<ForwardLeadDialog
					isForward
					lead={leadToForward}
					onOpenChange={setIsForwardDialogOpen}
					open={isForwardDialogOpen}
				/>
			)}
			<CreateLeadDialog
				isPending={isCreatePending}
				onOpenChangeAction={setIsCreateDialogOpen}
				onSubmitAction={createLead}
				open={isCreateDialogOpen}
			/>
		</div>
	);
}
