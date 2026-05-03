'use client';

import type { ReactNode } from 'react';

import { ArrowRightIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Separator } from '@/src/components/ui';
import { LINKS } from '@/src/constants';

interface FunctionTocItem {
  depth: number;
  title?: ReactNode;
  url: string;
}

interface FunctionTocProps {
  hooks: string[];
  items: FunctionTocItem[];
  name: string;
  type: string;
}

export const FunctionToc = ({ type, name, items, hooks }: FunctionTocProps) => {
  const itemIds = items.map((item) => item.url.replace('#', ''));
  const [activeId, setActiveId] = useState<string | null>(null);

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

    for (const id of itemIds ?? []) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      for (const id of itemIds ?? []) {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      }
    };
  }, []);

  return (
    <nav className='sticky top-0 flex flex-col gap-2 p-4 pt-0 text-sm'>
      <p className='text-md text-foreground font-semibold'>On this page</p>
      <ul className='flex flex-col gap-2'>
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
            href={`${LINKS.DOCS_REPOSITORY}/content/functions/${type}s/${name}.mdx`}
            rel='noopener noreferrer'
            target='_blank'
          >
            <div className='flex items-center gap-2'>
              <div>Edit page on GitHub</div> <ExternalLinkIcon className='size-4' />
            </div>
          </a>
        </li>

        <li>
          <a
            className='text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-md no-underline transition-colors data-[active=true]:font-medium data-[depth=3]:pl-4 data-[depth=4]:pl-6'
            href={`${LINKS.CORE_REPOSITORY}/${type}s/${name}/${name}.demo.tsx`}
            rel='noopener noreferrer'
            target='_blank'
          >
            Watch demo
          </a>
        </li>

        <li>
          <a
            className='text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-md no-underline transition-colors data-[active=true]:font-medium data-[depth=3]:pl-4 data-[depth=4]:pl-6'
            href={`${LINKS.CORE_REPOSITORY}/${type}s/${name}/${name}.ts`}
            rel='noopener noreferrer'
            target='_blank'
          >
            <div className='flex items-center gap-2'>Source</div>
          </a>
        </li>
      </ul>

      {!!hooks.length && (
        <div className='bg-card mt-4 flex flex-col gap-6 rounded-md p-4'>
          <div className='flex flex-col gap-2'>
            <p className='text-muted-foreground text-lg font-semibold'>Dependencies</p>
            <p className='text-muted-foreground text-md'>
              This hook depends on the following hooks:
            </p>
          </div>

          <ul className='flex flex-col gap-2'>
            <li>
              <ul className='flex flex-col gap-2'>
                {hooks.map((hook) => (
                  <Link
                    key={hook}
                    className='text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-md no-underline transition-colors data-[active=true]:font-medium data-[depth=3]:pl-4 data-[depth=4]:pl-6'
                    href={`/functions/hooks/${hook}`}
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
      )}
    </nav>
  );
};
