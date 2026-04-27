import { siteConfig } from '@docs/lib/config';
import { source } from '@docs/lib/source';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import { CommandMenu } from './command-menu';
import { GitHubLink } from './github-link';
import { Icons } from './icons';
import { MobileNav } from './mobile-nav';
import { ModeSwitcher } from './mode-switcher';

const CHANGELOG_ITEMS = [
  {
    version: '0.3.8',
    date: 'Apr 27, 2026',
    description: 'useQuery improvements, bug fixes'
  },
  {
    version: '0.3.7',
    date: 'Apr 12, 2026',
    description: 'Added useDisplayMedia, useDropZone'
  },
  {
    version: '0.3.6',
    date: 'Mar 28, 2026',
    description: 'Performance improvements, new hooks'
  }
];

export const SiteHeader = () => {
  const pageTree = source.pageTree;
  const docsHref = siteConfig.navItems[0]?.href || '/docs/installation';

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur'>
      <div className='container-wrapper 3xl:fixed:px-0 flex h-(--header-height) items-center justify-between gap-3 px-3'>
        <div className='flex min-w-0 items-center gap-1'>
          <MobileNav className='flex lg:hidden' items={siteConfig.navItems} />

          <Link className='inline-flex items-center gap-2 lg:mr-1' href='/'>
            <Icons.logo className='size-[15px] shrink-0' />
            <span className='text-foreground text-[15px] font-semibold tracking-tight'>
              {siteConfig.name.toLowerCase()}
            </span>
          </Link>

          <Separator className='mx-1 hidden h-5 lg:block' orientation='vertical' />

          <Button
            asChild
            className='text-muted-foreground hover:text-foreground hidden h-8 px-2.5 text-sm shadow-none lg:inline-flex'
            size='sm'
            variant='ghost'
          >
            <Link href={docsHref}>Docs</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className='text-muted-foreground hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground hidden h-8 gap-1 px-2.5 text-sm shadow-none lg:inline-flex'
                size='sm'
                variant='ghost'
              >
                Changelog
                <ChevronDown className='size-3.5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-[17.5rem] p-1'>
              <DropdownMenuLabel className='px-2.5 pt-2 pb-1 text-[10px] tracking-[0.08em] uppercase'>
                Recent Releases
              </DropdownMenuLabel>

              {CHANGELOG_ITEMS.map((item) => (
                <DropdownMenuItem asChild key={item.version}>
                  <Link
                    className='flex flex-col items-start gap-1 rounded-md px-2.5 py-2.5'
                    href={`https://github.com/siberiacancode/reactuse/releases/tag/v${item.version}`}
                    rel='noreferrer'
                    target='_blank'
                  >
                    <span className='flex items-center gap-2 leading-none'>
                      <span className='font-mono text-xs font-semibold'>v{item.version}</span>
                      <span className='text-muted-foreground text-[11px]'>{item.date}</span>
                    </span>
                    <span className='text-muted-foreground text-xs leading-relaxed'>
                      {item.description}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  className='text-muted-foreground hover:text-foreground justify-center text-xs'
                  href='https://github.com/siberiacancode/reactuse/releases'
                  rel='noreferrer'
                  target='_blank'
                >
                  View all releases →
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className='flex min-w-0 items-center justify-end gap-1'>
          <div className='hidden w-[clamp(14rem,28vw,24rem)] md:block'>
            <CommandMenu navItems={siteConfig.navItems} tree={pageTree} />
          </div>

          <Separator className='mx-1 hidden h-5 lg:block' orientation='vertical' />

          <GitHubLink />

          <Button asChild className='h-8 shadow-none' size='sm' variant='ghost'>
            <Link href={siteConfig.links.npm} rel='noreferrer' target='_blank'>
              <Icons.npm />
            </Link>
          </Button>

          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
};
