import { siteConfig } from '@docs/lib/config';
import { source } from '@docs/lib/source';
import Link from 'next/link';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { CommandMenu } from './command-menu';
import { GitHubLink } from './github-link';
import { Icons } from './icons';
import { MobileNav } from './mobile-nav';
import { ModeSwitcher } from './mode-switcher';

export const SiteHeader = () => {
  const pageTree = source.pageTree;

  return (
    <header className='bg-background sticky top-0 z-50 w-full px-12 py-2'>
      <div className='container-wrapper 3xl:fixed:px-0 grid min-h-(--header-height) grid-cols-[auto_1fr_auto] items-center px-3 py-2 md:grid-cols-[1fr_minmax(0,34rem)_1fr]'>
        <div className='flex items-center gap-2'>
          <MobileNav className='flex lg:hidden' items={siteConfig.navItems} />
          <Link className='hidden items-center gap-2 lg:inline-flex' href='/'>
            <Icons.logo className='size-7' />
            <span className='font-display text-foreground text-[1.7rem] font-bold tracking-tight'>
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <div className='hidden w-full px-2 md:block'>
          <div className='w-full'>
            <CommandMenu navItems={siteConfig.navItems} tree={pageTree} />
          </div>
        </div>

        <div className='flex items-center justify-end gap-2 sm:gap-0.5'>
          <Separator className='hidden lg:block' orientation='vertical' />
          <Button asChild className='h-8 shadow-none' size='sm' variant='ghost'>
            <Link href={siteConfig.links.npm} rel='noreferrer' target='_blank'>
              <Icons.npm />
            </Link>
          </Button>
          <GitHubLink />
          <Separator className='3xl:flex hidden' orientation='vertical' />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
};
