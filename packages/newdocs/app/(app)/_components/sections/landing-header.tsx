import type { ComponentProps } from 'react';

import { Icons } from '@docs/components/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import { Button } from '@/src/components/ui';
import { CONFIG, LINKS } from '@/src/constants';

import { ThemeButton } from '../ThemeButton/ThemeButton';

interface MarqueeItem {
  id: string;
  label: string;
}

const createMarqueeItems = (hooks: string[]): MarqueeItem[] => [
  ...hooks.map((hook) => ({ id: `${hook}-first`, label: hook })),
  ...hooks.map((hook) => ({ id: `${hook}-second`, label: hook }))
];

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
  const items = createMarqueeItems(
    hooks.map((hook) => hook.name).sort((a, b) => a.localeCompare(b))
  );

  return (
    <>
      <header
        className='bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full backdrop-blur'
        {...props}
      >
        <div className='container-wrapper container flex h-(--header-height) items-center justify-between gap-3 px-8'>
          <div className='hidden min-w-0 items-center justify-between gap-3 lg:flex'>
            <Link className='inline-flex items-center gap-2' href='/'>
              <Image alt='ReactUse' height={12} src='/new/logo.svg' width={12} />

              <span className='text-foreground text-lg font-semibold tracking-tight'>
                {CONFIG.NAME}
              </span>
            </Link>

            <div className='flex items-center gap-2'>
              <Button asChild className='rounded-full' size='sm' variant='ghost'>
                <Link href='/docs/installation'>Docs</Link>
              </Button>

              <Button asChild className='rounded-full' size='sm' variant='ghost'>
                <Link href='/functions'>Functions</Link>
              </Button>
            </div>
          </div>

          <div className='flex min-w-0 items-center justify-end gap-2'>
            <Button asChild className='rounded-full' size='sm'>
              <Link href='/docs/installation' rel='noreferrer' target='_blank'>
                Getting Started
              </Link>
            </Button>

            <div className='flex items-center gap-1'>
              <Button asChild className='rounded-full' variant='ghost'>
                <Link href={LINKS.GITHUB} rel='noreferrer' target='_blank'>
                  <Icons.gitHub className='size-4.5' />

                  <span className='text-muted-foreground text-xs tabular-nums'>
                    {formattedCount}
                  </span>
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
          className='border-border flex h-8 overflow-hidden border-t'
        >
          <div className='animate-marquee flex w-max items-center gap-1 whitespace-nowrap'>
            {items.map((item) => (
              <Fragment key={item.id}>
                <div className='text-muted-foreground text-[10px]'>•</div>
                <div className='text-muted-foreground inline-flex items-center gap-4 px-[18px] font-mono text-xs tracking-tight'>
                  {item.label}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </header>
    </>
  );
};
