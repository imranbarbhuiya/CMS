import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next/client';

export const useToken = () =>
	useQuery({
		queryKey: ['token'],
		queryFn: async () => getCookie('token') ?? null,
	});
