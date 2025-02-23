'use client';
// import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import type { PropsWithChildren } from 'react';

const queryClient = new QueryClient();
// 	{
// 	defaultOptions: {
// 		queries: {
// 			gcTime: 1_000 * 60 * 60 * 24, // 24 hours
// 		},
// 	},
// }

// const persister = createSyncStoragePersister({
// 	storage: typeof window === 'undefined' ? null : window.localStorage,
// });

export const Providers = ({ children }: PropsWithChildren) => (
	<QueryClientProvider client={queryClient}>
		<NuqsAdapter>{children}</NuqsAdapter>
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);
