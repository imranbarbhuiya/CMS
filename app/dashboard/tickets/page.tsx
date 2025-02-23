'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDownWideNarrow, Search } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useState, useRef } from 'react';

import { TicketList } from '@/app/dashboard/tickets/ticket-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToken } from '@/hooks/use-token';
import { Api } from '@/lib/fetch';

import { TicketEmptySvg } from './empty-svg';

import type { components } from '@/openapi/api';

type UpdateTicketDto = components['schemas']['UpdateTicketDto'];
type TicketResponse = components['schemas']['FindAllTicketsDto'];

export default function TicketPage() {
	const { data: token } = useToken();
	const [currentPage, setCurrentPage] = useState(1);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [searchTerm, setSearchTerm] = useQueryState('search', parseAsString.withDefault(''));

	const { data, isFetched } = useQuery({
		queryKey: ['/tickets/my', { currentPage, searchTerm, limit: 10 }],
		queryFn: async () => {
			const { data, error } = await Api.GET('/tickets/my', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					query: {
						limit: 9,
						page: currentPage,
						search: searchTerm,
					},
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');
			return data;
		},
		enabled: Boolean(token),
	});

	const queryClient = useQueryClient();

	const { mutate: updateStatus } = useMutation({
		mutationFn: async ({ status, ticketId }: { status: NonNullable<UpdateTicketDto['status']>; ticketId: string }) => {
			const { data, error } = await Api.PATCH('/tickets/{id}', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					path: { id: ticketId },
				},
				body: { status },
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		onMutate: async ({ ticketId, status }) => {
			await queryClient.cancelQueries({ queryKey: ['/tickets/my'] });

			const previousTickets = queryClient.getQueryData<TicketResponse>([
				'/tickets',
				{ currentPage, searchTerm, limit: 10 },
			]);

			queryClient.setQueryData<TicketResponse>(['/tickets', { currentPage, searchTerm, limit: 10 }], (old) => {
				if (!old) return old;
				return {
					...old,
					data: old.data.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket)),
				};
			});

			return { previousTickets };
		},
		onError: (_, __, context) =>
			context?.previousTickets &&
			queryClient.setQueryData<TicketResponse>(
				['/tickets/my', { currentPage, searchTerm, limit: 10 }],
				context.previousTickets,
			),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['/tickets/my'] });
		},
	});

	const tickets = data?.data ?? [];

	const handleSearch = () => {
		void setSearchTerm(searchInputRef.current?.value ?? '');
		setCurrentPage(1);
	};

	return (
		<div className="space-y-4 p-3 md:p-8">
			<div className="flex items-center justify-start">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Tickets</h1>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Input
						className="max-w-sm"
						defaultValue={searchTerm}
						onKeyDown={(ev) => {
							if (ev.key === 'Enter') handleSearch();
						}}
						placeholder="Search ticket using name, id..."
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
				<Button className="gap-2" variant="outline">
					Sort-By
					<ArrowDownWideNarrow className="size-4" />
				</Button>
			</div>
			{isFetched ? (
				tickets.length ? (
					<TicketList onStatusChangeAction={updateStatus} tickets={tickets} />
				) : (
					<div className="flex flex-col items-center justify-center gap-1.5 pt-20 text-[#2563EB] [&:is(.rose_*)]:text-[#E11D48]">
						<TicketEmptySvg />
						<p className="text-2xl font-medium leading-8 tracking-[-0.6px] text-primary">No Tickets at the Moment</p>
					</div>
				)
			) : (
				<div className="flex items-center justify-center pt-20">
					<div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
				</div>
			)}
		</div>
	);
}
