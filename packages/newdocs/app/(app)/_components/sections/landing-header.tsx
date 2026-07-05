import type { ComponentProps } from 'react';

import { Icons } from '@docs/components/icons';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import { Button, Marquee } from '@/src/components/ui';
import { CONFIG, LINKS } from '@/src/constants';

import { ThemeButton } from '../ThemeButton/ThemeButton';

const formatStarsCount = (count: number) => {
  if (count < 1000) return count;
  return `${Math.round(count / 1000)}${count >= 1000 ? 'k' : ''}`;
};

export interface LandingHeaderHook {
  name: string;
}

export interface LandingHeaderRepository {
  stargazersCount: number;
}

export interface LandingHeaderProps extends ComponentProps<'header'> {
  hooks: LandingHeaderHook[];
  repository: LandingHeaderRepository;
}

export const LandingHeader = ({ hooks, repository, ...props }: LandingHeaderProps) => {
  const formattedCount = formatStarsCount(repository.stargazersCount);
  const sortedHooks = hooks.map((hook) => hook.name).sort((a, b) => a.localeCompare(b));

  return (
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

                <span className='text-muted-foreground text-xs tabular-nums'>{formattedCount}</span>
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

      <div
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
        }}
        className='border-border h-8 overflow-hidden border-t'
      >
        <Marquee className='h-full p-0 [--duration:250s] [--gap:0.25rem]'>
          {sortedHooks.map((name) => (
            <Fragment key={name}>
              <div className='text-muted-foreground inline-flex items-center gap-4 px-[18px] font-mono text-xs tracking-tight'>
                {name}
              </div>
              <div className='flex items-center text-[10px]'>•</div>
            </Fragment>
          ))}
        </Marquee>
      </div>
    </header>
  );
};
