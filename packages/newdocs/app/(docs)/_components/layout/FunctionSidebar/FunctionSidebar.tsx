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
      className='sticky top-[calc(var(--header-height)+0.75rem)] z-30 hidden h-[calc(100svh-var(--header-height)-0.75rem)] overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex'
      collapsible='none'
      {...props}
    >
      <div className='from-background/75 via-background/25 pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b to-transparent' />
      <div className='from-background/75 via-background/25 pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t to-transparent' />
      <div className='absolute top-12 right-2 bottom-0 hidden h-full w-px bg-gradient-to-b from-transparent to-transparent lg:flex' />
      <SidebarContent className='no-scrollbar w-(--sidebar-menu-width) overflow-x-hidden px-2'>
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
