import type { PageTreeFolder } from '@docs/lib/page-tree';
import type { Folder, Item } from 'fumadocs-core/page-tree';
import type { CSSProperties, ReactNode } from 'react';

import { functionsSource, source } from '@docs/lib/source';
import { SidebarProvider } from '@docs/src/components/ui/sidebar';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import type { FunctionBadges } from '@/src/constants';

import { FunctionHeader, FunctionSidebar } from './_components';

const DEFAULT_BADGES = {
  firstCommitAt: 0,
  isApiUpdated: false,
  isNew: false,
  lastCommitAt: 0
};

const getFunctionsBadges = async () => {
  const hooksPath = path.join(process.cwd(), 'content', 'functions', 'hooks');
  const files = await fs.readdir(hooksPath);
  const metaFiles = files.filter((file) => file.endsWith('.meta.json') && file !== 'meta.json');
  const entries = await Promise.all(
    metaFiles.map(async (file) => {
      const content = await fs.readFile(path.join(hooksPath, file), 'utf-8');
      const metadata = JSON.parse(content) as { badges?: FunctionBadges; name: string };

      return [metadata.name, metadata.badges ?? DEFAULT_BADGES] as const;
    })
  );

  return new Map(entries);
};

const getHooksSidebarGroups = async () => {
  const functionsBadges = await getFunctionsBadges();
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
      groups[currentGroup!]!.children.push({
        ...element,
        badge: functionsBadges.get(element.name!.toString()) ?? DEFAULT_BADGES
      });
    }
  });

  return Object.values(groups) as Folder[];
};

interface DocsLayoutProps {
  children: ReactNode;
}

export const DocsLayout = async ({ children }: DocsLayoutProps) => {
  const functionsBadges = await getFunctionsBadges();
  const functionsSidebarGroups = await getHooksSidebarGroups();
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
            badge: DEFAULT_BADGES,
            name: 'llms.txt',
            url: '/llms.txt'
          };
        }
        return {
          badge: functionsBadges.get(name) ?? DEFAULT_BADGES,
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
