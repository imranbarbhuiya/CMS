'use client';

import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001', {
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
	email: string;
	id: string;
	name: string;
	phone?: string;
	status: string;
}

export interface TicketPayload {
	assignee?: string;
	id: string;
	priority: string;
	status: string;
	title: string;
}

export const socketEvents = {
	Announcement: 'announcement',
	Lead: 'lead',
	Ticket: 'ticket',
} as const;

export type SocketEvents = typeof socketEvents;

export interface SocketEventsHandlersMap {
	[socketEvents.Announcement]: (payload: AnnouncementPayload) => void | Promise<void>;
	[socketEvents.Lead]: (payload: LeadPayload) => void | Promise<void>;
	[socketEvents.Ticket]: (payload: TicketPayload) => void | Promise<void>;
}
