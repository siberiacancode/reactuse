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
} from '@docs/ui/sidebar';
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
      className='sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-1px)] overscroll-none bg-transparent [--sidebar-menu-width:--spacing(64)] lg:flex'
      collapsible='none'
      {...props}
    >
      <div className='pointer-events-none absolute top-8 z-10 h-8 w-(--sidebar-menu-width) shrink-0 bg-linear-to-b from-background via-background/80 to-background/50 blur-xs' />
      <div className='from-background/75 via-background/25 pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t to-transparent' />
      <SidebarContent className='no-scrollbar h-full w-(--sidebar-menu-width) overflow-y-auto overscroll-contain px-2 pt-12 pb-22'>
        {groups.map((group, index) => (
          <SidebarGroup key={index}>
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
