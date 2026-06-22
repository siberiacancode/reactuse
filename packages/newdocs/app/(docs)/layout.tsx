import type { PageTreeFolder } from '@docs/lib/page-tree';
import type { Folder, Item } from 'fumadocs-core/page-tree';
import type { CSSProperties, ReactNode } from 'react';

import { functionsSource, source } from '@docs/lib/source';
import { SidebarProvider } from '@docs/src/components/ui/sidebar';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { FunctionHeader, FunctionSidebar } from './_components';

const getFunctionsBadges = async () => {
  const hooksPath = path.join(process.cwd(), 'content', 'functions', 'hooks');
  const hooksFiles = await fs.readdir(hooksPath);

  const hooksMetaFiles = hooksFiles.filter(
    (file) => file.endsWith('.meta.json') && file !== 'meta.json'
  );

  const helpersPath = path.join(process.cwd(), 'content', 'functions', 'helpers');
  const helpersFiles = await fs.readdir(helpersPath);

  const helpersMetaFiles = helpersFiles.filter(
    (file) => file.endsWith('.meta.json') && file !== 'meta.json'
  );

  const entries = await Promise.all([
    ...hooksMetaFiles.map(async (file) => {
      const content = await fs.readFile(path.join(hooksPath, file), 'utf-8');
      const metadata = JSON.parse(content) as { badges?: { isNew?: boolean }; name: string };

      return [metadata.name, metadata.badges?.isNew ?? false] as const;
    }),
    ...helpersMetaFiles.map(async (file) => {
      const content = await fs.readFile(path.join(helpersPath, file), 'utf-8');
      const metadata = JSON.parse(content) as { badges?: { isNew?: boolean }; name: string };

      return [metadata.name, metadata.badges?.isNew ?? false] as const;
    })
  ]);

  return new Map(entries);
};

const getFunctionsSidebarGroups = async () => {
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

  const helpersFolder = functionsSource.pageTree.children.find(
    (element) => element.type === 'folder' && element.$id === 'helpers'
  ) as PageTreeFolder;

  helpersFolder.children.forEach((element) => {
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
  const functionsBadges = await getFunctionsBadges();
  const functionsSidebarGroups = await getFunctionsSidebarGroups();
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
            external: true,
            isNew: false,
            name: 'llms.txt',
            url: '/llms.txt'
          };
        }
        return {
          external: false,
          isNew: functionsBadges.get(name) ?? false,
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
