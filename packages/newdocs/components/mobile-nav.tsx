'use client';

import type { LinkProps } from 'next/link';

import { cn } from '@docs/lib/utils';
import { Button } from '@docs/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@docs/ui/popover';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { TOP_LEVEL_SECTIONS } from './docs-sidebar';

const MobileLink = ({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();
  return (
    <Link
      className={cn('flex items-center gap-2 text-2xl font-medium', className)}
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

export const MobileNav = ({
  items,
  className
}: {
  items: { href: string; label: string }[];
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent',
            className
          )}
          variant='ghost'
        >
          <div className='relative flex h-8 w-4 items-center justify-center'>
            <div className='relative size-4'>
              <span
                className={cn(
                  'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                  open ? 'top-[0.4rem] -rotate-45' : 'top-1'
                )}
              />
              <span
                className={cn(
                  'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                  open ? 'top-[0.4rem] rotate-45' : 'top-2.5'
                )}
              />
            </div>
            <span className='sr-only'>Toggle Menu</span>
          </div>
          <span className='flex h-8 items-center text-lg leading-none font-medium'>Menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        alignOffset={-16}
        className='bg-background/90 no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100 data-open:animate-none!'
        side='bottom'
        sideOffset={6}
      >
        <div className='flex flex-col gap-12 overflow-auto px-6 py-6'>
          <div className='flex flex-col gap-4'>
            <div className='text-muted-foreground text-sm font-medium'>Menu</div>
            <div className='flex flex-col gap-3'>
              <MobileLink href='/' onOpenChange={setOpen}>
                Home
              </MobileLink>
              {items.map((item) => (
                <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}>
                  {item.label}
                </MobileLink>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='text-muted-foreground text-sm font-medium'>Sections</div>
            <div className='flex flex-col gap-3'>
              {TOP_LEVEL_SECTIONS.map(({ name, href }) => (
                <MobileLink key={name} href={href} onOpenChange={setOpen}>
                  MobileNav
                </MobileLink>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
