import { Button } from './ui/button';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { Icons } from './icons';
import { Separator } from './ui/separator';
import { GitHubLink } from './github-link';
import { ModeSwitcher } from './mode-switcher';
import { CommandMenu } from './command-menu';
import { source } from '@/lib/source';

export function SiteHeader() {
  const pageTree = source.pageTree;

  return (
    <header className='bg-background sticky top-0 z-50 w-full'>
      <div className='container-wrapper 3xl:fixed:px-0 px-6'>
        <div className='3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:!h-4'>
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
          <div className='ml-auto flex items-center gap-2 md:flex-1 md:justify-end'>
            <CommandMenu tree={pageTree} navItems={siteConfig.navItems} />
            <Separator orientation='vertical' className='ml-2 hidden lg:block' />
            <GitHubLink />
            <Separator orientation='vertical' />
            <ModeSwitcher />
            <Separator orientation='vertical' className='mr-2' />
          </div>
        </div>
      </div>
    </header>
  );
}
