import type { ComponentProps } from 'react';

import { Icons } from '@docs/components/icons';
import { functionsSource, source } from '@docs/lib/source';
import { CONFIG, LINKS } from '@docs/src/constants';
import { ArrowUpRightIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/src/components/ui';
import { getLatestReleases, getRepository } from '@/src/utils/api';
import { formatCount } from '@/src/utils/helpers';

import { Burger, Search, ThemeButton } from './components';

interface FunctionHeaderGroup {
  items: { name: string; url: string; external: boolean }[];
  name: string;
}

export interface FunctionHeaderProps extends ComponentProps<'header'> {
  groups: FunctionHeaderGroup[];
}

export const FunctionHeader = async ({ groups, ...props }: FunctionHeaderProps) => {
  const [repositoryResponse, releasesResponse] = await Promise.all([
    getRepository(),
    getLatestReleases()
  ]);

  const [release] = releasesResponse.data;
  const releaseName = release?.name ?? release?.tag_name;

  return (
    <header className='bg-background/95 sticky top-0 z-50 w-full' {...props}>
      <div className='flex h-(--header-height) w-full items-center justify-between gap-3'>
        <Burger className='lg:hidden' groups={groups} />

        <div className='hidden min-w-0 items-center justify-between gap-3 lg:flex'>
          <Link className='inline-flex items-center gap-2' href='/' prefetch={false}>
            <Image alt='ReactUse' height={12} src='/logo.svg' width={12} />

            <span className='text-foreground text-lg font-semibold tracking-tight'>
              {CONFIG.NAME}
            </span>
          </Link>

          <NavigationMenu viewport={false}>
            <NavigationMenuList className='gap-2'>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href='/docs/installation' prefetch={false}>
                    Docs
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href='/docs/functions' prefetch={false}>
                    Functions
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href='/blog' prefetch={false}>
                    Blog
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {releaseName && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>{releaseName}</NavigationMenuTrigger>
                  <NavigationMenuContent className='top-full left-auto z-50 mt-1.5'>
                    <ul className='w-40'>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            className='group'
                            href={LINKS.CHANGELOG}
                            rel='noreferrer'
                            target='_blank'
                          >
                            <div className='flex flex-row items-center justify-between gap-4'>
                              <span className='font-medium'>Changelog</span>
                              <ArrowUpRightIcon className='text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            className='group'
                            href={LINKS.CONTRIBUTING}
                            rel='noreferrer'
                            target='_blank'
                          >
                            <div className='flex flex-row items-center justify-between gap-4'>
                              <span className='font-medium'>Contributing</span>
                              <ArrowUpRightIcon className='text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className='flex min-w-0 items-center justify-end gap-2'>
          <div className='hidden md:block'>
            <Search tree={[...source.pageTree.children, ...functionsSource.pageTree.children]} />
          </div>

          <div className='flex items-center gap-1'>
            <Button asChild className='rounded-full' variant='outline'>
              <Link href={LINKS.GITHUB} prefetch={false} rel='noreferrer' target='_blank'>
                <Icons.gitHub className='size-4.5' />
                <StarIcon className='size-3.5' />
                <span className='text-muted-foreground text-xs tabular-nums'>
                  {formatCount(repositoryResponse.data.stargazers_count)}
                </span>
              </Link>
            </Button>

            <Button asChild className='rounded-full' size='icon' variant='ghost'>
              <Link href={LINKS.NPM} prefetch={false} rel='noreferrer' target='_blank'>
                <Icons.npm className='size-4.5' />
              </Link>
            </Button>

            <ThemeButton />
          </div>
        </div>
      </div>
    </header>
  );
};
