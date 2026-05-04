import type { ReactNode } from 'react';

import { LandingHeader } from './_components';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => (
  <div className='bg-background relative z-10 flex min-h-svh flex-col' data-slot='layout'>
    <LandingHeader />

    <main className='flex flex-1 flex-col'>{children}</main>
  </div>
);

export default AppLayout;
