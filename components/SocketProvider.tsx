'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
						{announcement.createdAt}
					</Badge>
				</div>
				<p className="text-sm text-muted-foreground">{announcement.content}</p>
			</div>
		</div>
	);
}

export function SocketProvider({ children }: { readonly children: React.ReactNode }) {
	const { data: token } = useToken();
	const { data: user } = useUser();

	useEffect(() => {
		if (!token || !user) {
			disconnectSocket();
			return;
		}

		connectSocket(token);

		const handleAnnouncement: SocketEventsHandlersMap[SocketEvents['Announcement']] = async (props) => {
			const audio = new Audio('/notification.mp3');
			try {
				await audio.play();
			} catch (error) {
				console.error(error);
			}

			toast(<AnnouncementToast announcement={props} />, {
				duration: 4_000,
			});
		};

		socket.on(socketEvents.Announcement, handleAnnouncement);

		return () => {
			socket.off(socketEvents.Announcement, handleAnnouncement);
			disconnectSocket();
		};
	}, [token, user]);

	return <>{children}</>;
}
