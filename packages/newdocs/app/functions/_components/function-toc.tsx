'use client';

import type { ReactNode } from 'react';

import { useIntersectionObserver } from '@siberiacancode/reactuse';
import Link from 'next/link';
import { useState } from 'react';

import { Separator } from '@/ui/separator';
import { ExternalLinkIcon } from 'lucide-react';

export const REPOSITORY_LINK =
  'https://github.com/siberiacancode/reactuse/blob/main/packages/core/src';

interface FunctionTocItem {
  depth: number;
  title?: ReactNode;
  url: string;
}

interface FunctionTocProps {
  items: FunctionTocItem[];
  name: string;
  type: string;
}

export const FunctionToc = ({ type, name, items }: FunctionTocProps) => {
  const itemIds = items.map((item) => item.url.replace('#', ''));
  const [activeId, setActiveId] = useState<string | null>(null);

  const intersectionObserver = useIntersectionObserver<HTMLHeadingElement>({
    onChange: (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      }

      for (const id of itemIds ?? []) {
        const element = document.getElementById(id);
        if (element) {
          intersectionObserver.observer?.observe(element);
        }
      }
    },
    rootMargin: '0% 0% -80% 0%'
  });

  return (
    <div className='sticky top-0 flex flex-col gap-2 p-4 pt-0 text-sm'>
      <p className='text-md text-foreground font-semibold'>On this page</p>
      {items.map((item) => (
        <Link
          key={item.url}
          className='text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-[0.8rem] no-underline transition-colors data-[active=true]:font-medium data-[depth=3]:pl-4 data-[depth=4]:pl-6'
          data-active={item.url === `#${activeId}`}
          data-depth={item.depth}
          href={item.url}
        >
          {item.title}
        </Link>
      ))}

      <Separator className='my-2' />
      <ul>
        <li>
          <a
            className='text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-[0.8rem] no-underline transition-colors data-[active=true]:font-medium data-[depth=3]:pl-4 data-[depth=4]:pl-6'
            href={`${REPOSITORY_LINK}/${type}s/${name}/${name}.ts`}
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
            className='text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-[0.8rem] no-underline transition-colors data-[active=true]:font-medium data-[depth=3]:pl-4 data-[depth=4]:pl-6'
            href={`${REPOSITORY_LINK}/${type}s/${name}/${name}.demo.tsx`}
            rel='noopener noreferrer'
            target='_blank'
          >
            Watch demo
          </a>
        </li>
      </ul>
    </div>
  );
};
