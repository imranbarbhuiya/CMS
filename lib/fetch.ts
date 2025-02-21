import createClient from 'openapi-fetch';

import type { paths as ApiPaths } from '@/openapi/api';

export const CoreApi = createClient<ApiPaths>({
	baseUrl: process.env.NEXT_PUBLIC_API_BASE,
});
