'use client';

import type { ComponentProps } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@docs/src/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface FunctionSidebarGroup {
  items: { name: string; url: string }[];
  name: string;
}

export interface FunctionSidebarProps extends ComponentProps<typeof Sidebar> {
  groups: FunctionSidebarGroup[];
}

export const FunctionSidebar = ({ groups, ...props }: FunctionSidebarProps) => {
  const pathname = usePathname();

  return (
    <Sidebar
      className='sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-5rem)] overscroll-none bg-transparent [--sidebar-menu-width:var(--sidebar-width)] xl:flex'
      collapsible='none'
      {...props}
    >
      <div className='from-background via-background/80 to-background/50 pointer-events-none absolute inset-x-0 top-0 z-10 h-12 shrink-0 bg-linear-to-b blur-xs' />

      <SidebarContent className='no-scrollbar h-full w-(--sidebar-menu-width) gap-5 overflow-x-hidden overflow-y-auto overscroll-contain pt-12 pb-12'>
        {groups.map((group, index) => (
          <SidebarGroup key={index} className='p-0'>
            <SidebarGroupLabel className='text-muted-foreground font-medium capitalize'>
              {group.name}
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
                        <span className='relative block min-w-0 truncate'>{item.name}</span>
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
