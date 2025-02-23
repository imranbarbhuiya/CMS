'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { LeadDialog } from '@/app/dashboard/leads/lead-dialog';
import { ForwardLeadDialog } from '@/app/dashboard/tickets/ticket-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToken } from '@/hooks/use-token';
import { useUser } from '@/hooks/use-user';

import {
	socket,
	socketEvents,
	connectSocket,
	disconnectSocket,
	type SocketEventsHandlersMap,
	type SocketEvents,
	type AnnouncementPayload,
} from '../lib/socket';

function AnnouncementToast({ announcement }: { readonly announcement: AnnouncementPayload }) {
	return (
		<div className="flex items-start gap-4">
			<Avatar className="size-8">
				<AvatarFallback>{announcement.fromName.charAt(0)}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<span className="font-medium">{announcement.fromName}</span>
					<Badge className="text-[10px]" variant="secondary">
						{new Date(announcement.createdAt).toLocaleString(undefined, {
							month: 'short',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
						})}
					</Badge>
				</div>
				<p className="text-sm text-muted-foreground">{announcement.content}</p>
			</div>
		</div>
	);
}

function NewToast({
	lead,
	isTicket,
	onView,
}: {
	readonly isTicket?: boolean;
	readonly lead: { name: string };
	readonly onView: () => void;
}) {
	useEffect(() => {
		const audio = new Audio(isTicket ? '/lead.wav' : '/ticket.wav');
		audio.loop = true;
		const playAudio = async () => {
			try {
				await audio.play();
			} catch (error) {
				console.error(error);
			}
		};
		void playAudio();

		return () => {
			audio.pause();
			audio.currentTime = 0;
		};
	}, [isTicket]);

	return (
		<div className="flex h-[74px] items-center gap-4 self-stretch rounded-[2px] bg-themecolor-600 p-4 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-4px_rgba(0,0,0,0.10)]">
			<div className="flex flex-[1_0_0] flex-col items-start gap-0.5">
				<span className="self-stretch overflow-hidden text-ellipsis text-sm font-medium leading-5 text-foreground">
					New {isTicket ? 'Ticket' : 'Lead'}
				</span>
				<span className="self-stretch overflow-hidden text-ellipsis text-sm font-normal leading-5 text-foreground opacity-90">
					{lead.name}
				</span>
			</div>
			<Button className="bg-primary" onClick={onView}>
				View
			</Button>
		</div>
	);
}

export function SocketProvider({ children }: { readonly children: React.ReactNode }) {
	const { data: token } = useToken();
	const { data: user } = useUser();
	const [leadDialogOpen, setLeadDialogOpen] = useState(false);
	const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
	const [currentLead, setCurrentLead] = useState<any>(null);
	const [currentTicket, setCurrentTicket] = useState<any>(null);

	useEffect(() => {
		if (!token || !user) {
			disconnectSocket();
			return;
		}

		connectSocket(token);

		const handleAnnouncement: SocketEventsHandlersMap[SocketEvents['Announcement']] = async (props) => {
			const audio = new Audio('/notification.wav');
			try {
				await audio.play();
			} catch (error) {
				console.error(error);
			}

			toast(<AnnouncementToast announcement={props} />, {
				duration: 4_000,
			});
		};

		const handleLead: SocketEventsHandlersMap[SocketEvents['Lead']] = async (props) => {
			toast(
				<NewToast
					lead={props.leadData}
					onView={() => {
						setCurrentLead(props.leadData);
						setLeadDialogOpen(true);
						toast.dismiss(props.leadData.id);
					}}
				/>,
				{
					closeButton: false,
					duration: Infinity,
					dismissible: false,
					unstyled: true,
					id: props.leadData.id,
				},
			);
		};

		const handleTicket: SocketEventsHandlersMap[SocketEvents['Ticket']] = async (props) => {
			toast(
				<NewToast
					isTicket
					lead={props.ticketData.leadDetails}
					onView={() => {
						setCurrentTicket(props.ticketData);
						setTicketDialogOpen(true);
						toast.dismiss(props.ticketData.id);
					}}
				/>,
				{
					closeButton: false,
					duration: Infinity,
					dismissible: false,
					unstyled: true,
					id: props.ticketData.id,
				},
			);
		};

		socket.on(socketEvents.Announcement, handleAnnouncement);
		socket.on(socketEvents.Lead, handleLead);
		socket.on(socketEvents.Ticket, handleTicket);

		return () => {
			socket.off(socketEvents.Announcement, handleAnnouncement);
			socket.off(socketEvents.Lead, handleLead);
			socket.off(socketEvents.Ticket, handleTicket);

			disconnectSocket();
		};
	}, [token, user]);

	return (
		<>
			{children}
			<LeadDialog lead={currentLead} onOpenChange={setLeadDialogOpen} open={leadDialogOpen} showAcceptButton />
			<ForwardLeadDialog
				address={currentTicket?.address}
				lead={currentTicket?.leadDetails}
				note={currentTicket?.note}
				onOpenChange={setTicketDialogOpen}
				open={ticketDialogOpen}
				payment={currentTicket?.payment}
				subscription={currentTicket?.subscription}
				ticketId={currentTicket?.id}
			/>
		</>
	);
}
