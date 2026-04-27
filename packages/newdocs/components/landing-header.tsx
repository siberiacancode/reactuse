/* eslint-disable react/no-array-index-key */
'use client';

import { siteConfig } from '@docs/lib/config';
import { Badge } from '@docs/ui/badge';
import { Button } from '@docs/ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Icons } from './icons';
import { ModeSwitcher } from './mode-switcher';

const LATEST_RELEASE = {
  version: '0.3.8',
  notes: 'useQuery improvements & bug fixes',
  href: 'https://github.com/siberiacancode/reactuse/releases/tag/v0.3.8'
};

const HEADER_HOOKS = [
  'useAsync',
  'useBoolean',
  'useClipboard',
  'useCounter',
  'useDebounceState',
  'useDisclosure',
  'useDocumentTitle',
  'useEvent',
  'useEventListener',
  'useLocalStorage',
  'useMediaQuery',
  'useMount',
  'useWindowSize',
  'useBattery',
  'useGeolocation',
  'useHover',
  'useIdle',
  'useIntersectionObserver',
  'useInterval',
  'useKeyPress',
  'useMouse',
  'useNetwork'
] as const;

const LandingHooksMarquee = () => {
  const items = useMemo(() => [...HEADER_HOOKS, ...HEADER_HOOKS], []);

  return (
    <div
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
      }}
      className='border-border flex h-8 overflow-hidden border-t'
    >
      <div className='animate-marquee flex w-max items-center whitespace-nowrap'>
        {items.map((hook, index) => (
          <span
            key={`${hook}-${index}`}
            className='text-muted-foreground inline-flex items-center gap-4 px-[18px] font-mono text-xs tracking-tight'
          >
            <span className='text-border text-[10px]'>*</span>
            {hook}
          </span>
        ))}
      </div>
    </div>
  );
};

export const LandingHeader = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 border-b backdrop-blur'>
      {isAnnouncementVisible && (
        <div className='border-border relative flex h-9 items-center justify-center border-b px-4'>
          <Link
            className='group text-foreground inline-flex max-w-[calc(100%-3rem)] items-center gap-2 text-xs sm:text-sm'
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

          <Button
            className='text-muted-foreground hover:text-foreground absolute right-2 size-7'
            size='icon-sm'
            variant='ghost'
            onClick={() => setIsAnnouncementVisible(false)}
          >
            <X className='size-3.5' />
            <span className='sr-only'>Dismiss announcement</span>
          </Button>
        </div>
      )}

      <div className='container-wrapper 3xl:fixed:px-0 flex h-[60px] items-center justify-between gap-2 px-3'>
        <div className='flex min-w-0 items-center gap-1'>
          <Link className='inline-flex items-center gap-2 md:mr-1' href='/'>
            <Icons.logo className='size-[15px] shrink-0' />
            <span className='text-foreground text-[15px] font-semibold tracking-tight'>
              reactuse
            </span>
          </Link>

          <div className='bg-border mx-1 hidden h-5 w-px md:block' />

          <Button
            asChild
            className='text-muted-foreground hover:text-foreground hidden h-8 px-2.5 text-sm shadow-none md:inline-flex'
            size='sm'
            variant='ghost'
          >
            <Link href='/docs/installation'>Docs</Link>
          </Button>

          <Button
            asChild
            className='text-muted-foreground hover:text-foreground hidden h-8 px-2.5 text-sm shadow-none md:inline-flex'
            size='sm'
            variant='ghost'
          >
            <Link
              href='https://github.com/siberiacancode/reactuse/releases'
              rel='noreferrer'
              target='_blank'
            >
              Changelog
            </Link>
          </Button>
        </div>

        <div className='flex items-center gap-1.5'>
          <Button asChild className='h-8 px-2.5 shadow-none' size='sm' variant='ghost'>
            <Link href={siteConfig.links.github} rel='noreferrer' target='_blank'>
              <Icons.gitHub className='size-4' />
              <span className='hidden text-xs sm:inline-flex'>GitHub</span>
            </Link>
          </Button>

          <Button asChild className='h-8 rounded-md px-4 text-sm' size='sm'>
            <Link href='/docs/installation'>Get Started</Link>
          </Button>

          <ModeSwitcher />
        </div>
      </div>

      <LandingHooksMarquee />
    </header>
  );
};
