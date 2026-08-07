import type { ComponentProps } from 'react';

import { Icons } from '@docs/components/icons';
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
import { CONFIG, LINKS } from '@/src/constants';
import { formatCount } from '@/src/utils/helpers';
import { cn } from '@/utils/lib';

import { ThemeButton } from '../ThemeButton/ThemeButton';

export interface LandingHeaderRepository {
  stargazersCount: number;
}

export interface LandingHeaderProps extends ComponentProps<'header'> {
  releaseName: string;
  stars: number;
}

/** Shared look for the floating pill cards — translucent, hairline, blurred. */
const pill =
  'bg-background/70 supports-[backdrop-filter]:bg-background/60 border-border/70 rounded-xl border backdrop-blur';

export const LandingHeader = ({ releaseName, stars, className, ...props }: LandingHeaderProps) => (
  <header className={cn('pointer-events-none absolute inset-x-0 top-3 z-50', className)} {...props}>
    <div className='container flex items-center justify-between gap-3 px-6 pt-4'>
      {/* left cluster: brand + nav + version, each a floating card */}
      <div className='pointer-events-auto flex items-center gap-2'>
        <Link
          className={cn(pill, 'inline-flex items-center gap-2 px-4 py-2')}
          href='/'
          prefetch={false}
        >
          <Image alt='ReactUse' height={12} src='/logo.svg' width={12} />
          <span className='text-foreground text-sm font-semibold tracking-tight'>
            {CONFIG.NAME}
          </span>
        </Link>

        <NavigationMenu className={cn(pill, 'hidden px-1.5 py-1 lg:flex')} viewport={false}>
          <NavigationMenuList className='gap-1'>
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
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className='pointer-events-auto flex items-center gap-2'>
        <Button asChild className='rounded-full'>
          <Link href='/docs/installation' prefetch={false}>
            Getting Started
          </Link>
        </Button>

        <div className={cn(pill, 'flex items-center gap-1 p-1')}>
          <Button asChild className='rounded-full' variant='ghost'>
            <Link href={LINKS.GITHUB} prefetch={false} rel='noreferrer' target='_blank'>
              <Icons.gitHub className='size-4.5' />
              <StarIcon className='size-3.5' />
              <span className='text-muted-foreground text-xs tabular-nums'>
                {formatCount(stars)}
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
