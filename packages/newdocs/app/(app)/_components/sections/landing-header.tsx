import type { ComponentProps } from 'react';

import { Icons } from '@docs/components/icons';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import { Button, Marquee } from '@/src/components/ui';
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
  stars: number;
}

export const LandingHeader = ({ hooks, stars, ...props }: LandingHeaderProps) => (
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

        <div className='flex items-center gap-2'>
          <Button asChild className='rounded-full' size='sm' variant='ghost'>
            <Link href='/docs/installation' prefetch={false}>
              Docs
            </Link>
          </Button>

          <Button asChild className='rounded-full' size='sm' variant='ghost'>
            <Link href='/docs/functions' prefetch={false}>
              Functions
            </Link>
          </Button>
        </div>
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
