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
    <header className='bg-background sticky top-0 z-50 w-full'>
      <div className='container-wrapper 3xl:fixed:px-0 flex items-center justify-between px-6'>
        <MobileNav className='flex lg:hidden' items={siteConfig.navItems} tree={pageTree} />
        <div className='group-has-data-[slot=designer]/layout:fixed:max-w-none 3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:h-4!'>
          <Button asChild className='hidden size-8 lg:flex' size='icon' variant='ghost'>
            <Link href='/'>
              <Icons.logo className='size-5' />
              <span className='sr-only'>{siteConfig.name}</span>
            </Link>
          </Button>
          <div className='hidden w-full flex-1 md:flex md:w-auto md:flex-none'>
            {siteConfig.navItems.map((navItem) => (
              <Button
                asChild
                key={navItem.href}
                className='hidden h-[31px] rounded-lg sm:flex'
                size='sm'
                variant='ghost'
              >
                <Link href={navItem.href}>{navItem.label}</Link>
              </Button>
            ))}
          </div>
        </div>
        <div className='3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:!h-4'>
          <div className='flex items-center gap-2 sm:gap-0.5 md:flex-1 md:justify-end'>
            <div className='hidden w-full flex-1 md:flex md:w-auto md:flex-none'>
              <CommandMenu navItems={siteConfig.navItems} tree={pageTree} />
            </div>
            <Separator className='ml-2 hidden lg:block' orientation='vertical' />
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
      </div>
    </header>
  );
}
