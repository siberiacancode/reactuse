'use client';

import type { ReactNode } from 'react';

import { useBoolean, useWindowScroll } from '@siberiacancode/reactuse';
import { cva } from 'class-variance-authority';
import { ArrowRightIcon, ArrowUpIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { Separator } from '@/src/components/ui/separator';

export const tocLinkStyle = cva(
  'text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-md no-underline transition-colors data-[active=true]:font-medium data-[depth=3]:pl-4 data-[depth=4]:pl-6'
);

interface TocItem {
  depth: number;
  title?: ReactNode;
  url: string;
}

export const Toc = ({ children }: { children: ReactNode }) => (
  <nav className='sticky top-0 flex flex-col gap-2 p-4 pt-0 text-sm'>{children}</nav>
);

export const TocTitle = ({ children }: { children: ReactNode }) => (
  <p className='text-md text-foreground font-semibold'>{children}</p>
);

export const TocList = ({ children }: { children: ReactNode }) => (
  <ul className='mt-2 flex flex-col gap-2'>{children}</ul>
);

export const TocItems = ({ items }: { items: TocItem[] }) => {
  const itemIds = useMemo(() => items.map((item) => item.url.replace('#', '')), [items]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    for (const id of itemIds) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => {
      for (const id of itemIds) {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [itemIds]);

  return (
    <>
      {items.map((item) => (
        <li key={item.url}>
          <Link
            className={tocLinkStyle()}
            data-active={item.url === `#${activeId}`}
            data-depth={item.depth}
            href={item.url}
            prefetch={false}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </>
  );
};

export const TocSeparator = () => <Separator className='my-2' />;

interface TocLinkProps {
  children: ReactNode;
  href: string;
}

export const TocLink = ({ href, children }: TocLinkProps) => (
  <li>
    <a className={tocLinkStyle()} href={href} rel='noopener noreferrer' target='_blank'>
      {children}
    </a>
  </li>
);

export const TocEditLink = ({ href }: { href: string }) => (
  <TocLink href={href}>
    <div className='flex items-center gap-2'>
      <div>Edit page on GitHub</div> <ExternalLinkIcon className='size-4' />
    </div>
  </TocLink>
);

export const TocScrollToTop = () => {
  const [showScrollToTop, toggleShowScrollToTop] = useBoolean(false);
  const windowScroll = useWindowScroll(({ y }) => {
    toggleShowScrollToTop(y > 200);
  });

  return (
    <li
      aria-hidden={!showScrollToTop}
      className='transition-opacity duration-100 ease-out'
      data-visible={showScrollToTop}
    >
      <button
        className='text-muted-foreground hover:text-foreground text-md flex items-center gap-2 no-underline transition-opacity duration-100 ease-out data-[visible=false]:pointer-events-none data-[visible=false]:opacity-0'
        data-visible={showScrollToTop}
        tabIndex={showScrollToTop ? 0 : -1}
        type='button'
        onClick={() => windowScroll.scrollTo({ y: 0, behavior: 'smooth' })}
      >
        <span>Scroll to top</span>
        <ArrowUpIcon className='size-4' />
      </button>
    </li>
  );
};

export const TocDependencies = ({ hooks }: { hooks: string[] }) => {
  if (!hooks.length) return null;

  return (
    <div className='bg-card mt-4 flex flex-col gap-6 rounded-md p-4'>
      <div className='flex flex-col gap-2'>
        <p className='text-muted-foreground text-lg font-semibold'>Dependencies</p>
        <p className='text-muted-foreground text-md'>This hook depends on the following hooks:</p>
      </div>

      <ul className='flex flex-col gap-2'>
        <li>
          <ul className='flex flex-col gap-2'>
            {hooks.map((hook) => (
              <Link
                key={hook}
                className={tocLinkStyle()}
                href={`/functions/hooks/${hook}`}
                prefetch={false}
              >
                <div className='flex items-center gap-1'>
                  {hook}
                  <ArrowRightIcon className='size-4' />
                </div>
              </Link>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};
