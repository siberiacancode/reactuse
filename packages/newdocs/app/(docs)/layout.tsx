import type { ReactNode } from 'react';

import { DocsSidebar } from '@docs/components/docs-sidebar';
import { getFunctionsSidebarGroups } from '@docs/lib/element-docs';
import { source } from '@docs/lib/source';
import { SidebarProvider } from '@docs/ui/sidebar';

import { Header } from './_components/layout';

interface DocsLayoutProps {
  children: ReactNode;
}

export const DocsLayout = async ({ children }: DocsLayoutProps) => {
  const groups = await getFunctionsSidebarGroups();

  return (
    <main className='mx-auto flex w-full max-w-[1600px] flex-col'>
      <Header />

      <div className='container-wrapper flex flex-1 flex-col px-2'>
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)'
            } as React.CSSProperties
          }
          className='3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--top-spacing:calc(var(--spacing)*4)]'
        >
          <DocsSidebar functionsGroups={groups} tree={source.pageTree} />
          <div className='h-full w-full'>{children}</div>
        </SidebarProvider>
      </div>
    </main>
  );
};

export default DocsLayout;
