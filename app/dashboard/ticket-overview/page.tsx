'use client';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDownWideNarrow, Search } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useRef, useEffect } from 'react';

import { TicketBoard } from '@/app/dashboard/ticket-overview/ticket-board';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToken } from '@/hooks/use-token';
import { Api } from '@/lib/fetch';

import { TicketEmptySvg } from '../tickets/empty-svg';

import type { components } from '@/openapi/api';

type UpdateTicketDto = components['schemas']['UpdateTicketDto'];
type TicketResponse = components['schemas']['FindAllTicketsDto'];

const ITEMS_PER_PAGE = 9;

export default function TicketOverviewPage() {
	const { data: token } = useToken();
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [searchTerm, setSearchTerm] = useQueryState('search', parseAsString.withDefault(''));
	const loaderRef = useRef<HTMLDivElement>(null);

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
		queryKey: ['/tickets/my', { limit: 'infinite', searchTerm }],
		queryFn: async ({ pageParam = 1 }) => {
			const { data, error } = await Api.GET('/tickets/my', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					query: {
						page: pageParam,
						limit: ITEMS_PER_PAGE,
						search: searchTerm,
					},
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');
			return data;
		},
		getNextPageParam: (lastPage) => {
			if (lastPage.data.length < ITEMS_PER_PAGE) return undefined;
			return lastPage.data.length / ITEMS_PER_PAGE + 1;
		},
		initialPageParam: 1,
		enabled: Boolean(token),
	});

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) void fetchNextPage();
			},
			{ threshold: 0.5 },
		);

		if (loaderRef.current) observer.observe(loaderRef.current);

		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

			const previousTickets = queryClient.getQueryData<{ pages: TicketResponse[] }>([
				'/tickets/my',
				{ limit: 'infinite', searchTerm },
			]);

			queryClient.setQueryData<{ pages: TicketResponse[] }>(
				['/tickets/my', { limit: 'infinite', searchTerm }],
				(old) => {
					if (!old) return old;
					return {
						...old,
						pages: old.pages.map((page) => ({
							...page,
							data: page.data.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket)),
						})),
					};
				},
			);

			return { previousTickets };
		},
		onError: (_, __, context) =>
			context?.previousTickets &&
			queryClient.setQueryData<{ pages: TicketResponse[] }>(
				['/tickets/my', { limit: 'infinite', searchTerm }],
				context.previousTickets,
			),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['/tickets/my'] });
		},
	});

	const tickets = data?.pages.flatMap((page) => page.data) ?? [];

	const handleSearch = () => setSearchTerm(searchInputRef.current?.value ?? '');

	const handleStatusChange = async (id: string, newStatus: NonNullable<UpdateTicketDto['status']>) => {
		updateStatus({ ticketId: id, status: newStatus });
		const audio = new Audio('/swap.wav');
		try {
			await audio.play();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="space-y-4 p-3 md:p-8">
			<div className="flex items-center justify-start">
				<h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-primary">Ticket Overview</h1>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Input
						className="max-w-sm"
						defaultValue={searchTerm}
						onKeyDown={(ev) => {
							if (ev.key === 'Enter') void handleSearch();
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
			{isLoading ? (
				<div className="flex items-center justify-center pt-20">
					<div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
				</div>
			) : tickets.length ? (
				<>
					<TicketBoard onStatusChange={handleStatusChange} tickets={tickets} />
					<div className="flex justify-center py-4" ref={loaderRef}>
						{isFetchingNextPage && <div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>}
					</div>
				</>
			) : (
				<div className="flex flex-col items-center justify-center gap-1.5 pt-20 text-[#2563EB] [&:is(.rose_*)]:text-[#E11D48]">
					<TicketEmptySvg />
					<p className="text-2xl font-medium leading-8 tracking-[-0.6px] text-primary">No Tickets at the Moment</p>
				</div>
			)}
		</div>
	);
}
