import type { PageTreeFolder } from '@docs/lib/page-tree';
import type { Folder, Item } from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';

import { functionsSource, source } from '@docs/lib/source';
import { SidebarProvider } from '@docs/ui/sidebar';

import { FunctionHeader, FunctionSidebar } from './_components';

const getHooksSidebarGroups = () => {
  const groups = {} as any;
  let currentGroup: string | undefined;

  const hookFolder = functionsSource.pageTree.children.find(
    (element) => element.type === 'folder' && element.$id === 'hooks'
  ) as PageTreeFolder;

  hookFolder.children.forEach((element) => {
    if (element.type === 'separator') {
      currentGroup = element.name!.toString();
      groups[currentGroup] = {
        $id: element.name,
        children: [],
        name: element.name,
        type: 'folder'
      };
    }
    if (element.type === 'page') {
      groups[currentGroup!]!.children.push(element);
    }
  });

  return Object.values(groups) as Folder[];
};

interface DocsLayoutProps {
  children: ReactNode;
}

export const DocsLayout = async ({ children }: DocsLayoutProps) => {
  const functionsSidebarGroups = getHooksSidebarGroups();
  const sidebarGroups = ([...source.pageTree.children, ...functionsSidebarGroups] as Folder[]).map(
    (group) => ({
      name: group.name?.toString() ?? 'unknown',
      items: (group.children as Item[]).map((child) => {
        const name = child.name?.toString() ?? 'unknown';
        if (name === 'llms.txt') {
          return {
            name: 'llms.txt',
            url: '/llms.txt'
          };
        }
        return {
          name: child.name?.toString() ?? 'unknown',
          url: child.url
        };
      })
    })
  );

  return (
    <main className='mx-auto flex w-full max-w-[1600px] flex-col'>
      <FunctionHeader groups={sidebarGroups} />

      <div className='container-wrapper mt-12 flex flex-1 flex-col px-5'>
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 75)'
            } as React.CSSProperties
          }
          className='3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--top-spacing:calc(var(--spacing)*4)]'
        >
          <FunctionSidebar groups={sidebarGroups} />
          <div className='h-full w-full'>{children}</div>
        </SidebarProvider>
      </div>
    </main>
  );
};

export default DocsLayout;
