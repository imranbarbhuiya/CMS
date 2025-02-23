import { useQuery } from '@tanstack/react-query';

import { Api } from '@/lib/fetch';

import { useToken } from './use-token';

export const useTeam = (team?: string | null) => {
	const { data: token } = useToken();

	return useQuery({
		queryKey: ['/teams/{id}'],
		queryFn: async () => {
			const { data, error } = await Api.GET('/teams/{id}', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
					path: {
						id: team!,
					},
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
		enabled: Boolean(token && team),
	});
};
