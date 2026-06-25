'use client';

import type { ReactNode } from 'react';

import { useBoolean, useWindowScroll } from '@siberiacancode/reactuse';
import { ArrowUpIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { Separator } from '@/src/components/ui/separator';
import { LINKS } from '@/src/constants';

interface DocsTocItem {
  depth: number;
  title?: ReactNode;
  url: string;
}

interface DocsTocProps {
  items: DocsTocItem[];
  path: string;
}

export const DocsToc = ({ path, items }: DocsTocProps) => {
  const itemIds = useMemo(() => items.map((item) => item.url.replace('#', '')), [items]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showScrollToTop, toggleShowScrollToTop] = useBoolean(false);
  const windowScroll = useWindowScroll(({ y }) => {
    toggleShowScrollToTop(y > 200);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    for (const id of itemIds) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      for (const id of itemIds) {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      }
    };
  }, [itemIds]);

  return (
    <nav className='sticky top-0 flex flex-col gap-2 p-4 pt-0 text-sm'>
      <p className='text-md text-foreground font-semibold'>On this page</p>
      <ul className='mt-2 flex flex-col gap-2'>
        {items.map((item) => (
          <li key={item.url}>
            <Link
              className='text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-md no-underline transition-colors data-[active=true]:font-medium data-[depth=3]:pl-4 data-[depth=4]:pl-6'
              data-active={item.url === `#${activeId}`}
              data-depth={item.depth}
              href={item.url}
            >
              {item.title}
            </Link>
          </li>
        ))}

        <Separator className='my-2' />

        <li>
          <a
            className='text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-md no-underline transition-colors data-[active=true]:font-medium data-[depth=3]:pl-4 data-[depth=4]:pl-6'
            href={`${LINKS.DOCS_REPOSITORY}/content/docs/${path}`}
            rel='noopener noreferrer'
            target='_blank'
          >
            <div className='flex items-center gap-2'>
              <div>Edit page on GitHub</div> <ExternalLinkIcon className='size-4' />
            </div>
          </a>
        </li>

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
      </ul>
    </nav>
  );
};
