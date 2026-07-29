import type { ComponentProps } from 'react';

import { Icons } from '@docs/components/icons';
import { ArrowUpRightIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import {
  Button,
  Marquee,
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

import { ThemeButton } from '../ThemeButton/ThemeButton';

export interface LandingHeaderHook {
  name: string;
}

export interface LandingHeaderRepository {
  stargazersCount: number;
}

export interface LandingHeaderProps extends ComponentProps<'header'> {
  hooks: LandingHeaderHook[];
  releaseName: string;
  stars: number;
}

export const LandingHeader = ({ hooks, releaseName, stars, ...props }: LandingHeaderProps) => (
  <header
    className='bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full backdrop-blur'
    {...props}
  >
    <div className='container flex h-(--header-height) items-center justify-between gap-3 px-6'>
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

      <div className='flex min-w-0 items-center justify-end gap-2'>
        <Button asChild className='rounded-full' size='sm'>
          <Link href='/docs/installation' prefetch={false}>
            Getting Started
          </Link>
        </Button>

        <div className='flex items-center gap-1'>
          <Button asChild className='rounded-full' variant='outline'>
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

    <div className='border-border h-8 overflow-hidden border-t [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]'>
      <Marquee className='h-full p-0 [--duration:250s] [--gap:0.25rem]'>
        {hooks.map((hook) => (
          <Fragment key={hook.name}>
            <div className='text-muted-foreground inline-flex items-center gap-4 px-[18px] font-mono text-xs tracking-tight'>
              {hook.name}
            </div>
            <div className='flex items-center text-[10px]'>•</div>
          </Fragment>
        ))}
      </Marquee>
    </div>
  </header>
);
