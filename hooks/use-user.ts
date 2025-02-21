import { useQuery } from '@tanstack/react-query';

import { Api } from '@/lib/fetch';

import { useToken } from './use-token';

export const useUser = () => {
	const { data: token } = useToken();

	return useQuery({
		queryKey: ['/me'],
		queryFn: async () => {
			const { data, error } = await Api.GET('/me', {
				params: {
					header: {
						Authorization: `Bearer ${token}`,
					},
				},
			});

			if (error) throw new Error(error.message ?? 'An error occurred');

			return data;
		},
	});
};
