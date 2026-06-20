import type { PageTreeFolder } from '@docs/lib/page-tree';
import type { Folder, Item } from 'fumadocs-core/page-tree';
import type { CSSProperties, ReactNode } from 'react';

import { functionsSource, source } from '@docs/lib/source';
import { SidebarProvider } from '@docs/src/components/ui/sidebar';

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
  const docsLayoutStyle = {
    '--docs-content-width': '58rem',
    '--docs-layout-gap': '1.5rem',
    '--sidebar-width': '15rem'
  } as CSSProperties;

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
    <main
      className='mx-auto flex w-full max-w-[calc(var(--docs-content-width)+var(--sidebar-width)+var(--sidebar-width)+var(--docs-layout-gap)+var(--docs-layout-gap))] flex-col px-4 lg:px-6'
      style={docsLayoutStyle}
    >
      <FunctionHeader groups={sidebarGroups} />

      <div className='flex flex-1 flex-col'>
        <SidebarProvider
          className='min-h-min flex-1 items-start [--top-spacing:0] xl:grid xl:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] xl:gap-[var(--docs-layout-gap)] xl:[--top-spacing:calc(var(--spacing)*4)]'
          style={docsLayoutStyle}
        >
          <FunctionSidebar groups={sidebarGroups} />
          <div className='h-full w-full'>{children}</div>
        </SidebarProvider>
      </div>
    </main>
  );
};

export default DocsLayout;
