import type { ComponentProps } from 'react';

import { functionsSource, source } from '@docs/lib/source';
import { CONFIG, LINKS } from '@docs/src/constants';
import { ArrowUpRightIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';

import { BrandAssetsMenu } from '@/src/components';
import { GithubIcon, LogoIcon, NpmIcon, TwitterIcon } from '@/src/components/icons';
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
          <BrandAssetsMenu>
            <Link className='inline-flex items-center gap-2' href='/' prefetch={false}>
              <LogoIcon className='size-4' />

              <span className='text-foreground text-lg font-semibold tracking-tight'>
                {CONFIG.NAME}
              </span>
            </Link>
          </BrandAssetsMenu>

          <NavigationMenu viewport={false}>
            <NavigationMenuList className='gap-2'>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href='/docs/installation' prefetch={false} />}
                >
                  Docs
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href='/docs/functions' prefetch={false} />}
                >
                  Functions
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href='/blog' prefetch={false} />}
                >
                  Blog
                </NavigationMenuLink>
              </NavigationMenuItem>

              {releaseName && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>{releaseName}</NavigationMenuTrigger>
                  <NavigationMenuContent className='top-full left-auto z-50 mt-1.5'>
                    <ul className='w-40'>
                      <li>
                        <NavigationMenuLink
                          render={
                            <Link
                              className='group'
                              href={LINKS.CHANGELOG}
                              rel='noreferrer'
                              target='_blank'
                            />
                          }
                        >
                          <div className='flex flex-row items-center justify-between gap-4'>
                            <span className='font-medium'>Changelog</span>
                            <ArrowUpRightIcon className='text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                          </div>
                        </NavigationMenuLink>
                      </li>

                      <li>
                        <NavigationMenuLink
                          render={
                            <Link
                              className='group'
                              href={LINKS.CONTRIBUTING}
                              rel='noreferrer'
                              target='_blank'
                            />
                          }
                        >
                          <div className='flex flex-row items-center justify-between gap-4'>
                            <span className='font-medium'>Contributing</span>
                            <ArrowUpRightIcon className='text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                          </div>
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
            <Button
              render={
                <Link href={LINKS.GITHUB} prefetch={false} rel='noreferrer' target='_blank' />
              }
              className='rounded-full'
              nativeButton={false}
              variant='outline'
            >
              <GithubIcon className='size-3.5' />
              <StarIcon className='size-3.5' />
              <span className='text-muted-foreground text-xs tabular-nums'>
                {formatCount(repositoryResponse.data.stargazers_count)}
              </span>
            </Button>

            <Button
              render={
                <Link
                  aria-label='Open npm package'
                  href={LINKS.NPM}
                  prefetch={false}
                  rel='noreferrer'
                  target='_blank'
                />
              }
              className='rounded-full'
              nativeButton={false}
              size='icon'
              variant='ghost'
            >
              <NpmIcon className='size-4.5' />
            </Button>

            <Button
              render={
                <Link
                  aria-label='Open X profile'
                  href={LINKS.TWITTER}
                  prefetch={false}
                  rel='noreferrer'
                  target='_blank'
                />
              }
              className='rounded-full'
              nativeButton={false}
              size='icon'
              variant='ghost'
            >
              <TwitterIcon className='size-4.5' />
            </Button>

            <ThemeButton />
          </div>
        </div>
      </div>
    </header>
  );
};
