'use client';

import type { source } from '@docs/lib/source';

import { getCurrentBase, getPagesFromFolder } from '@docs/lib/page-tree';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@docs/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type FunctionsSidebarGroup = {
  items: { name: string; url: string }[];
  title: string;
};

export const TOP_LEVEL_SECTIONS = [
  { name: 'Introduction', href: '/docs' },
  {
    name: 'Installation',
    href: '/docs/installation'
  },
  {
    name: 'reactuse.json',
    href: '/docs/reactuse-json'
  },
  {
    name: 'CLI',
    href: '/docs/cli'
  },
  {
    name: 'target',
    href: '/docs/target'
  },
  {
    name: 'memoization',
    href: '/docs/memoization'
  },
  {
    name: 'optimization',
    href: '/docs/optimization'
  }
];

const EXCLUDED_SECTIONS = ['Introduction'];

export const DocsSidebar = ({
  functionsGroups,
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  functionsGroups?: FunctionsSidebarGroup[];
  tree: typeof source.pageTree;
}) => {
  const pathname = usePathname();
  const currentBase = getCurrentBase(pathname);
  const topSectionHrefs = new Set(TOP_LEVEL_SECTIONS.map((section) => section.href));

  return (
    <Sidebar
      className='sticky top-[calc(var(--header-height)+0.75rem)] z-30 hidden h-[calc(100svh-var(--header-height)-0.75rem)] overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex'
      collapsible='none'
      {...props}
    >
      <div className='absolute top-12 right-2 bottom-0 hidden h-full w-px bg-gradient-to-b from-transparent to-transparent lg:flex' />
      <SidebarContent className='no-scrollbar w-(--sidebar-menu-width) overflow-x-hidden px-2'>
        <SidebarGroup className='pt-4'>
          <SidebarGroupLabel className='text-muted-foreground font-medium'>
            Getting Started
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOP_LEVEL_SECTIONS.map(({ name, href }) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton
                    asChild
                    className='data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-full overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-0 after:z-0 after:rounded-md'
                    isActive={href === '/docs' ? pathname === href : pathname.startsWith(href)}
                  >
                    <Link href={href}>
                      <span className='absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent' />
                      {name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {tree.children.map((item) => {
          if (EXCLUDED_SECTIONS.includes((item.name as string) ?? '')) {
            return null;
          }

          const pages =
            item.type === 'folder'
              ? getPagesFromFolder(item, currentBase).filter(
                  (page) => !topSectionHrefs.has(page.url)
                )
              : [];

          if (item.type === 'folder' && pages.length === 0) {
            return null;
          }

          return (
            <SidebarGroup key={item.$id}>
              <SidebarGroupLabel className='text-muted-foreground font-medium'>
                {item.name}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {item.type === 'folder' && (
                  <SidebarMenu className='gap-0.5'>
                    {pages.map((page) => (
                      <SidebarMenuItem key={page.url}>
                        <SidebarMenuButton
                          asChild
                          className='data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-full overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-0 after:z-0 after:rounded-md'
                          isActive={page.url === pathname}
                        >
                          <Link href={page.url}>
                            <span className='absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent' />
                            {page.name}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}

        {(functionsGroups ?? []).map((group) => (
          <SidebarGroup key={`functions-${group.title}`}>
            <SidebarGroupLabel className='text-muted-foreground font-medium'>
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className='gap-0.5'>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      className='data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-full overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-0 after:z-0 after:rounded-md'
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <span className='absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent' />
                        {item.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
