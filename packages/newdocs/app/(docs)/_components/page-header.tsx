'use client';

import type { ReactNode } from 'react';

import { Button } from '@docs/src/components/ui/button';
import { ButtonGroup } from '@docs/src/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@docs/src/components/ui/dropdown-menu';
import { useCopy } from '@siberiacancode/reactuse';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  FileTextIcon
} from 'lucide-react';
import Link from 'next/link';

import { LINKS, PROMPT_LINKS } from '@/src/constants';
import { getPromptUrl } from '@/src/utils/helpers';

export const PageHeader = ({ children }: { children: ReactNode }) => (
  <div className='flex flex-col gap-2'>{children}</div>
);

export const PageHeaderTopBar = ({ children }: { children: ReactNode }) => (
  <div className='flex items-center justify-between md:items-start'>{children}</div>
);

export const PageHeaderTitle = ({ children }: { children: ReactNode }) => (
  <h1 className='scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl'>{children}</h1>
);

export const PageHeaderDescription = ({ children }: { children: ReactNode }) => (
  <p className='text-muted-foreground text-[1.05rem] sm:text-base sm:text-balance md:max-w-[90%]'>
    {children}
  </p>
);

interface PageHeaderActionsProps {
  children?: ReactNode;
  markdown: string;
  markdownPath: string;
}

export const PageHeaderActions = ({ markdown, markdownPath, children }: PageHeaderActionsProps) => {
  const { copy, copied } = useCopy();

  return (
    <div className='docs-nav flex items-center gap-2'>
      <div className='hidden sm:block'>
        <div className='bg-secondary relative flex rounded-md *:[[data-slot=button]]:focus-visible:relative *:[[data-slot=button]]:focus-visible:z-10'>
          <ButtonGroup>
            <Button size='sm' variant='secondary' onClick={() => copy(markdown)}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              Copy Page
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button aria-label='Open actions' size='icon-sm' variant='secondary' />}
              >
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56 min-w-56'>
                <DropdownMenuItem
                  render={<a href={`/${markdownPath}`} rel='noopener noreferrer' target='_blank' />}
                >
                  <FileTextIcon />
                  View as Markdown
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {Object.entries(PROMPT_LINKS).map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    render={
                      <a
                        href={getPromptUrl(value.url, `${LINKS.SITE}/${markdownPath}`)}
                        rel='noopener noreferrer'
                        target='_blank'
                      />
                    }
                  >
                    {value.Icon}
                    {value.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </div>
      </div>

      {children}
    </div>
  );
};

interface PageHeaderNavProps {
  next?: string;
  previous?: string;
}

export const PageHeaderNav = ({ next, previous }: PageHeaderNavProps) => (
  <div className='ml-auto flex gap-2'>
    {previous && (
      <Button
        nativeButton={false}
        render={<Link href={previous} prefetch={false} />}
        size='icon-sm'
        variant='secondary'
      >
        <ArrowLeftIcon />
        <span className='sr-only'>Previous</span>
      </Button>
    )}
    {next && (
      <Button
        nativeButton={false}
        render={<Link href={next} prefetch={false} />}
        size='icon-sm'
        variant='secondary'
      >
        <span className='sr-only'>Next</span>
        <ArrowRightIcon />
      </Button>
    )}
  </div>
);
