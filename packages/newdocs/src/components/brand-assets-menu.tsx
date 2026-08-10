'use client';

import type { ReactNode } from 'react';

import { DownloadIcon } from 'lucide-react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@/src/components/ui';
import { cn } from '@/src/lib';

interface BrandAssetsMenuProps {
  children: ReactNode;
  className?: string;
}

const LOGOS = {
  dark: '/brand/logo-dark.svg',
  light: '/brand/logo-light.svg'
} as const;

export const BrandAssetsMenu = ({ children, className }: BrandAssetsMenuProps) => (
  <ContextMenu>
    <ContextMenuTrigger className={cn('inline-flex', className)}>{children}</ContextMenuTrigger>
    <ContextMenuContent align='start' className='w-56 min-w-56 p-2' side='right' sideOffset={8}>
      <ContextMenuGroup>
        <ContextMenuLabel className='px-2 py-1.5 text-sm'>Dark Mode</ContextMenuLabel>
        <ContextMenuItem
          className='gap-3 px-2 py-2 text-sm font-medium'
          render={<a download href={LOGOS.dark} />}
        >
          <DownloadIcon className='size-4' />
          Logo SVG
        </ContextMenuItem>
      </ContextMenuGroup>

      <ContextMenuSeparator className='my-2' />

      <ContextMenuGroup>
        <ContextMenuLabel className='px-2 py-1.5 text-sm'>Light Mode</ContextMenuLabel>
        <ContextMenuItem
          className='gap-3 px-2 py-2 text-sm font-medium'
          render={<a download href={LOGOS.light} />}
        >
          <DownloadIcon className='size-4' />
          Logo SVG
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
);
