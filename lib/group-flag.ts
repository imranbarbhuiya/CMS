import { flag } from 'flags/next';

import { Api } from './fetch';

export const isRoseGroupFlag = flag<boolean, boolean>({
	key: 'rose-group-flag',
	async identify({ cookies }) {
		const token = cookies.get('token')?.value;

		const { data } = await Api.GET('/teams/me', {
			params: {
				header: {
					Authorization: `Bearer ${token}`,
				},
			},
		});

		return data?.companyId === 'Red Company';
	},
	decide({ entities }) {
		return Boolean(entities);
	},
});
