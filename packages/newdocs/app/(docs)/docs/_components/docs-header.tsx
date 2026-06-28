'use client';

import { Button } from '@docs/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@docs/src/components/ui/dropdown-menu';
import { ButtonGroup } from '@docs/ui/button-group';
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

import { LINKS } from '@/src/constants';

import { getPromptUrl, PROMPT_LINKS } from '../../_helpers';

interface DocsHeaderProps {
  description?: string;
  markdown: string;
  next?: string;
  path: string;
  previous?: string;
  title: string;
}

export const DocsHeader = ({
  description,
  markdown,
  next,
  previous,
  path,
  title
}: DocsHeaderProps) => {
  const { copy, copied } = useCopy();

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between md:items-start'>
        <h1 className='scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl'>{title}</h1>
        <div className='docs-nav flex items-center gap-2'>
          <div className='hidden sm:block'>
            <div className='bg-secondary relative flex rounded-lg *:[[data-slot=button]]:focus-visible:relative *:[[data-slot=button]]:focus-visible:z-10'>
              <ButtonGroup>
                <Button size='sm' variant='secondary' onClick={() => copy(markdown)}>
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  Copy Page
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-label='Open actions' size='icon-sm' variant='secondary'>
                      <ChevronDownIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56 min-w-56'>
                    <DropdownMenuItem asChild>
                      <a
                        href={`/docs/${path.replace('.mdx', '.md')}`}
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        <FileTextIcon />
                        View as Markdown
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {Object.entries(PROMPT_LINKS).map(([key, value]) => (
                      <DropdownMenuItem asChild key={key}>
                        <a
                          href={getPromptUrl(
                            value.url,
                            `${LINKS.SITE}/docs/${path.replace('.mdx', '.md')}`
                          )}
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          {value.Icon}
                          {value.title}
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </ButtonGroup>
            </div>
          </div>
          <div className='ml-auto flex gap-2'>
            {previous && (
              <Button asChild size='icon-sm' variant='secondary'>
                <Link href={previous} prefetch={false}>
                  <ArrowLeftIcon />
                  <span className='sr-only'>Previous</span>
                </Link>
              </Button>
            )}
            {next && (
              <Button asChild size='icon-sm' variant='secondary'>
                <Link href={next} prefetch={false}>
                  <span className='sr-only'>Next</span>
                  <ArrowRightIcon />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      {description && (
        <p className='text-muted-foreground text-[1.05rem] sm:text-base sm:text-balance md:max-w-[90%]'>
          {description}
        </p>
      )}
    </div>
  );
};
