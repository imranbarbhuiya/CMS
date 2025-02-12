'use client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import type { PropsWithChildren } from 'react';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1_000 * 60 * 60 * 24, // 24 hours
		},
	},
});

const persister = createSyncStoragePersister({
	storage: typeof window === 'undefined' ? null : window.localStorage,
});

export const Providers = ({ children }: PropsWithChildren) => (
	<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
		{children}
	</PersistQueryClientProvider>
);
