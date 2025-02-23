'use client';

import { io } from 'socket.io-client';

import type { TicketWithLeadDto } from '@/app/dashboard/tickets/ticket-card';
import type { LeadDto } from '@/app/dashboard/tickets/ticket-dialog';

export const socket = io(process.env.NEXT_PUBLIC_API_BASE, {
	autoConnect: false,
	reconnection: true,
});

export const connectSocket = (token: string) => {
	if (socket.connected) return;

	socket.auth = { token };
	socket.connect();
};

export const disconnectSocket = () => {
	if (!socket.connected) return;
	socket.disconnect();
};

export interface AnnouncementPayload {
	content: string;
	createdAt: string;
	fromName: string;
}

export interface LeadPayload {
	leadData: LeadDto;
	message: string;
	title: 'New Lead';
}

export interface TicketPayload {
	message: string;
	ticketData: TicketWithLeadDto;
	title: 'New Ticket';
}

export const socketEvents = {
	Announcement: 'announcement',
	Lead: 'newLead',
	Ticket: 'newTicket',
} as const;

export type SocketEvents = typeof socketEvents;

export interface SocketEventsHandlersMap {
	[socketEvents.Announcement]: (payload: AnnouncementPayload) => void | Promise<void>;
	[socketEvents.Lead]: (payload: LeadPayload) => void | Promise<void>;
	[socketEvents.Ticket]: (payload: TicketPayload) => void | Promise<void>;
}
