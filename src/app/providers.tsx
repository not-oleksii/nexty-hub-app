'use client';

import { TanStackDevtools } from '@tanstack/react-devtools';
import { FormDevtoolsPanel } from '@tanstack/react-form-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { getQueryClient } from '@/server/utils/get-query-client';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
      <TanStackDevtools
        plugins={[
          {
            name: 'TanStack Query Panel',
            render: <ReactQueryDevtoolsPanel client={queryClient} />,
            defaultOpen: true,
          },
          {
            name: 'TanStack Form Panel',
            render: <FormDevtoolsPanel />,
          },
        ]}
      />
    </QueryClientProvider>
  );
}
