'use client';

import type { ComponentProps } from 'react';

import { TOP_LEVEL_SECTIONS } from '@docs/components/docs-sidebar';
import { cn } from '@docs/lib/utils';
import { Button } from '@docs/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@docs/ui/popover';
import { useDisclosure } from '@siberiacancode/reactuse';
import Link from 'next/link';

interface BurgerProps extends ComponentProps<typeof Button> {
  items: { href: string; label: string }[];
}

export const Burger = ({ items, className, ...props }: BurgerProps) => {
  const burger = useDisclosure(false);

  return (
    <Popover open={burger.opened} onOpenChange={burger.toggle}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent',
            className
          )}
          {...props}
          variant='ghost'
        >
          <div className='relative flex h-8 w-4 items-center justify-center'>
            <div className='relative size-4'>
              <span
                className={cn(
                  'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                  burger.opened ? 'top-[0.4rem] -rotate-45' : 'top-1'
                )}
              />
              <span
                className={cn(
                  'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                  burger.opened ? 'top-[0.4rem] rotate-45' : 'top-2.5'
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
              <Link className='text-2xl font-medium' href='/' onClick={burger.toggle}>
                Home
              </Link>
              {items.map((item) => (
                <Link
                  key={item.href}
                  className='text-2xl font-medium'
                  href={item.href}
                  onClick={burger.toggle}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='text-muted-foreground text-sm font-medium'>Sections</div>
            <div className='flex flex-col gap-3'>
              {TOP_LEVEL_SECTIONS.map(({ name, href }) => (
                <Link
                  key={name}
                  className='text-2xl font-medium'
                  href={href}
                  onClick={burger.toggle}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
