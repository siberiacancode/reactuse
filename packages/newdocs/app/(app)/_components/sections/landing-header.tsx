import type { ComponentProps } from 'react';

import { ArrowUpRightIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';

import { GithubIcon, LogoIcon, NpmIcon, TwitterIcon } from '@/src/components/icons';
import { BrandAssetsMenu } from '@/src/components';
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
import { CONFIG, LINKS } from '@/src/constants';
import { formatCount } from '@/src/utils/helpers';
import { cn } from '@/utils/lib';

import { ThemeButton } from '../theme-button';

export interface LandingHeaderRepository {
  stargazersCount: number;
}

export interface LandingHeaderProps extends ComponentProps<'header'> {
  releaseName: string;
  stars: number;
}

export const LandingHeader = ({ releaseName, stars, className, ...props }: LandingHeaderProps) => (
  <header className={cn('pointer-events-none absolute inset-x-0 top-3 z-50', className)} {...props}>
    <div className='container flex items-center justify-between gap-3 px-6 pt-4'>
      <div className='pointer-events-auto flex items-center gap-2'>
        <BrandAssetsMenu>
          <Link
            className='bg-background/70 supports-[backdrop-filter]:bg-background/60 border-border/70 inline-flex items-center gap-2 rounded-xl border px-4 py-2 backdrop-blur'
            href='/'
            prefetch={false}
          >
            <LogoIcon className='size-5' />
            <span className='text-foreground text-sm font-semibold tracking-tight'>
              {CONFIG.NAME}
            </span>
          </Link>
        </BrandAssetsMenu>

        <NavigationMenu className='bg-background/70 supports-[backdrop-filter]:bg-background/60 border-border/70 hidden rounded-xl border px-1.5 py-1 backdrop-blur lg:flex'>
          <NavigationMenuList className='gap-1'>
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
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className='pointer-events-auto flex items-center gap-2'>
        <Button
          className='rounded-full'
          nativeButton={false}
          render={<Link href='/docs/installation' />}
        >
          Getting Started
        </Button>

        <div className='bg-background/70 supports-[backdrop-filter]:bg-background/60 border-border/70 flex items-center gap-1 rounded-xl border p-1 backdrop-blur'>
          <Button
            className='rounded-full'
            nativeButton={false}
            render={<a href={LINKS.GITHUB} rel='noreferrer' target='_blank' />}
            variant='ghost'
          >
            <GithubIcon className='size-3.5' />
            <StarIcon className='size-3.5' />
            <span className='text-muted-foreground text-xs tabular-nums'>{formatCount(stars)}</span>
          </Button>

          <Button
            render={
              <a aria-label='Open npm package' href={LINKS.NPM} rel='noreferrer' target='_blank' />
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
              <a
                aria-label='Open X profile'
                href={LINKS.TWITTER}
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
