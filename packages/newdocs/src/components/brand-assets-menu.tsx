'use client';

import type { ReactNode } from 'react';

import { copy } from '@siberiacancode/reactuse';
import { CopyIcon, DownloadIcon, ImageIcon } from 'lucide-react';

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

const PNG_MIME_TYPE = 'image/png';

export const BrandAssetsMenu = ({ children, className }: BrandAssetsMenuProps) => {
  const onCopySvg = async (href: string) => {
    const svg = await fetch(href).then(response => response.text());
    await copy(svg);
  };

  const onCopyPng = async (href: string) => {
    const image = new Image();
    image.src = href;
    await image.decode();

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(image, 0, 0);

    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, PNG_MIME_TYPE)
    );
    if (!blob) return;

    await navigator.clipboard.write([new ClipboardItem({ [PNG_MIME_TYPE]: blob })]);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className={cn('inline-flex', className)}>{children}</ContextMenuTrigger>
      <ContextMenuContent align='start' className='w-60 min-w-60 p-2' side='right' sideOffset={8}>
        <ContextMenuGroup>
          <ContextMenuLabel className='px-2 py-1.5 text-sm'>Dark Mode</ContextMenuLabel>
          <ContextMenuItem
            className='gap-3 px-2 py-2 text-sm font-medium'
            render={<a download href={LOGOS.dark} />}
          >
            <DownloadIcon className='size-4' />
            Download SVG
          </ContextMenuItem>
          <ContextMenuItem
            className='gap-3 px-2 py-2 text-sm font-medium'
            onClick={() => onCopySvg(LOGOS.dark)}
          >
            <CopyIcon className='size-4' />
            Copy as SVG
          </ContextMenuItem>
          <ContextMenuItem
            className='gap-3 px-2 py-2 text-sm font-medium'
            onClick={() => onCopyPng(LOGOS.dark)}
          >
            <ImageIcon className='size-4' />
            Copy as PNG
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
            Download SVG
          </ContextMenuItem>
          <ContextMenuItem
            className='gap-3 px-2 py-2 text-sm font-medium'
            onClick={() => onCopySvg(LOGOS.light)}
          >
            <CopyIcon className='size-4' />
            Copy as SVG
          </ContextMenuItem>
          <ContextMenuItem
            className='gap-3 px-2 py-2 text-sm font-medium'
            onClick={() => onCopyPng(LOGOS.light)}
          >
            <ImageIcon className='size-4' />
            Copy as PNG
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
