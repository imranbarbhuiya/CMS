import { flag } from 'flags/next';

export const isRoseGroupFlag = flag<boolean, boolean>({
	key: 'rose-group-flag',
	identify({ cookies }) {
		const group = cookies.get('group')?.value;

		return group === 'rose';
	},
	decide({ entities }) {
		return Boolean(entities);
	},
});
