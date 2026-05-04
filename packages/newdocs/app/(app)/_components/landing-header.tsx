import { Fragment, type ComponentProps } from 'react';

import { Icons } from '@docs/components/icons';
import fetches from '@siberiacancode/fetches';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/src/components/ui';
import { CONFIG, LINKS } from '@/src/constants';
import { Badge } from '@/ui/badge';

import { ThemeButton } from './ThemeButton/ThemeButton';
import { getElements } from '@/scripts/helpers';

const LATEST_RELEASE = {
  href: 'https://github.com/siberiacancode/reactuse/releases/tag/v0.3.8',
  version: '0.3.8',
  notes: 'useQuery improvements & bug fixes'
};

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

export type LandingHeaderProps = ComponentProps<'header'>;

export const LandingHeader = async (props: LandingHeaderProps) => {
  const repositoryResponse = await fetches.get<{ stargazers_count: number }>(
    'https://api.github.com/repos/siberiacancode/reactuse',
    {
      cache: 'force-cache'
    }
  );

  const formattedCount = formatStarsCount(repositoryResponse.data.stargazers_count);

  const hooks = (await getElements('hook'))
    .map((hook) => hook.name)
    .sort((a, b) => a.localeCompare(b));
  const items = createMarqueeItems(hooks);

  return (
    <>
      <div className='border-border relative flex h-9 items-center justify-center border-b py-6'>
        <Link
          className='group text-foreground inline-flex items-center gap-2 text-xs sm:text-sm'
          href={LATEST_RELEASE.href}
          rel='noreferrer'
          target='_blank'
        >
          <Badge className='h-5 rounded-md px-1.5 py-0 text-[10px] tracking-[0.06em] uppercase'>
            New
          </Badge>
          <span className='text-muted-foreground truncate'>
            <span className='text-foreground font-medium'>v{LATEST_RELEASE.version}</span> -{' '}
            {LATEST_RELEASE.notes}
          </span>
          <span className='text-muted-foreground transition-transform group-hover:translate-x-0.5'>
            -&gt;
          </span>
        </Link>
      </div>
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
                <Link href='/docs/functions'>Functions</Link>
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
