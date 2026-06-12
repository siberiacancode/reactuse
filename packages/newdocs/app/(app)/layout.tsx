import type { ReactNode } from 'react';

import { getContributors } from '@/lib/contributors';
import { getElements } from '@/scripts/helpers';

import { DocsMetadataProvider } from '../_contexts/docs-metadata';
import { LandingHeader } from './_components';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = async ({ children }: AppLayoutProps) => {
  const [hooks, helpers, contributors] = await Promise.all([
    getElements('hook'),
    getElements('helper'),
    getContributors()
  ]);

  return (
    <DocsMetadataProvider
      metadata={{
        hooks,
        helpers,
        contributors
      }}
    >
      <div className='bg-background relative z-10 flex min-h-svh flex-col' data-slot='layout'>
        <LandingHeader />

        <main className='flex flex-1 flex-col'>{children}</main>
      </div>
    </DocsMetadataProvider>
  );
};

export default AppLayout;
