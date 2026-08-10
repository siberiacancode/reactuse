'use client';

import type { ComponentProps } from 'react';

import { cn } from '@docs/lib/utils';
import { Button } from '@docs/src/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@docs/ui/popover';
import { useDisclosure } from '@siberiacancode/reactuse';
import Link from 'next/link';

import { LINKS } from '@/src/constants';

interface BurgerItemGroup {
  items: { external?: boolean; name: string; url: string }[];
  name: string;
}

interface BurgerProps extends ComponentProps<typeof Button> {
  groups: BurgerItemGroup[];
}

const MENU_LINKS = [
  { external: false, name: 'Home', url: '/' },
  { external: false, name: 'Docs', url: '/docs/installation' },
  { external: false, name: 'Functions', url: '/docs/functions' },
  { external: false, name: 'Blog', url: '/blog' },
  { external: true, name: 'Changelog', url: LINKS.CHANGELOG },
  { external: true, name: 'Contributing', url: LINKS.CONTRIBUTING }
] as const;

export const Burger = ({ groups, className, ...props }: BurgerProps) => {
  const burger = useDisclosure(false);

  return (
    <Popover open={burger.opened} onOpenChange={burger.toggle}>
      <PopoverTrigger
        render={
          <Button
            className={cn(
              'extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent aria-expanded:bg-transparent aria-expanded:text-inherit dark:hover:bg-transparent dark:aria-expanded:bg-transparent',
              className
            )}
            {...props}
            variant='ghost'
          />
        }
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
      </PopoverTrigger>
      <PopoverContent
        align='start'
        alignOffset={-16}
        className='bg-background/90 no-scrollbar h-(--available-height) w-(--available-width) overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100 data-open:animate-none!'
        side='bottom'
        sideOffset={6}
      >
        <div className='flex flex-col gap-12 overflow-auto px-6 py-6'>
          <div className='flex flex-col gap-4'>
            <div className='text-muted-foreground text-sm font-medium'>Menu</div>
            <div className='flex flex-col gap-3'>
              {MENU_LINKS.map((item) => {
                const Component = item.external ? 'a' : Link;

                return (
                  <Component
                    key={item.url}
                    href={item.url}
                    {...(item.external
                      ? { rel: 'noreferrer', target: '_blank' }
                      : { prefetch: false })}
                    onClick={burger.close}
                  >
                    {item.name}
                  </Component>
                );
              })}
            </div>
          </div>
          {groups.map((group) => (
            <div key={group.name} className='flex flex-col gap-4'>
              <div className='text-muted-foreground text-sm font-medium'>{group.name}</div>
              <div className='flex flex-col gap-3'>
                {group.items.map((item) => {
                  const Component = item.external ? 'a' : Link;
                  return (
                    <Component
                      key={item.url}
                      href={item.url}
                      {...(item.external
                        ? { rel: 'noreferrer', target: '_blank' }
                        : { prefetch: false })}
                    >
                      {item.name}
                    </Component>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
