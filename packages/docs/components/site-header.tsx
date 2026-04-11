import { Button } from '../ui/button';
import Link from 'next/link';
import { siteConfig } from '@docs/lib/config';
import { Icons } from './icons';
import { Separator } from '../ui/separator';
import { GitHubLink } from './github-link';
import { ModeSwitcher } from './mode-switcher';
import { CommandMenu } from './command-menu';
import { source } from '@docs/lib/source';
import { MobileNav } from './mobile-nav';

export function SiteHeader() {
  const pageTree = source.pageTree;

  return (
    <header className='bg-background sticky top-0 z-50 w-full'>
      <div className='container-wrapper 3xl:fixed:px-0 flex items-center justify-between px-6'>
        <MobileNav tree={pageTree} items={siteConfig.navItems} className='flex lg:hidden' />
        <div className='group-has-data-[slot=designer]/layout:fixed:max-w-none 3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:h-4!'>
          <Button asChild variant='ghost' size='icon' className='hidden size-8 lg:flex'>
            <Link href='/'>
              <Icons.logo className='size-5' />
              <span className='sr-only'>{siteConfig.name}</span>
            </Link>
          </Button>
          <div className='hidden w-full flex-1 md:flex md:w-auto md:flex-none'>
            {siteConfig.navItems.map((navItem) => (
              <Button
                key={navItem.href}
                asChild
                size='sm'
                variant='ghost'
                className='hidden h-[31px] rounded-lg sm:flex'
              >
                <Link href={navItem.href}>{navItem.label}</Link>
              </Button>
            ))}
          </div>
        </div>
        <div className='3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:!h-4'>
          <div className='flex items-center gap-2 sm:gap-0.5 md:flex-1 md:justify-end'>
            <div className='hidden w-full flex-1 md:flex md:w-auto md:flex-none'>
              <CommandMenu tree={pageTree} navItems={siteConfig.navItems} />
            </div>
            <Separator orientation='vertical' className='ml-2 hidden lg:block' />
            <Button asChild size='sm' variant='ghost' className='h-8 shadow-none'>
              <Link href={siteConfig.links.npm} target='_blank' rel='noreferrer'>
                <Icons.npm />
              </Link>
            </Button>
            <GitHubLink />
            <Separator orientation='vertical' className='3xl:flex hidden' />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
