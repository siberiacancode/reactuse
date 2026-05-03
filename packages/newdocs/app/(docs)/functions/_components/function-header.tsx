'use client';

import { Badge } from '@docs/ui/badge';
import { Button } from '@docs/ui/button';
import { ButtonGroup } from '@docs/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@docs/ui/dropdown-menu';
import { useCopy } from '@siberiacancode/reactuse';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconFlame,
  IconMarkdown,
  IconRosetteDiscountCheck,
  IconRosetteDiscountCheckOff
} from '@tabler/icons-react';
import Link from 'next/link';

import { LINKS } from '@/src/constants';

import { getPromptUrl, PROMPT_LINKS } from '../../_helpers';
import { CATEGORIES } from '../_constants/categories';

interface FunctionHeaderProps {
  category: string;
  description?: string;
  isTest: boolean;
  markdown: string;
  name: string;
  next?: string;
  previous?: string;
  type: string;
  usage: string;
}

export const FunctionHeader = ({
  category,
  usage,
  type,
  description,
  name,
  next,
  markdown,
  previous,
  isTest
}: FunctionHeaderProps) => {
  const { copy, copied } = useCopy();

  const categoryMeta = CATEGORIES[category as keyof typeof CATEGORIES]!;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between md:items-start'>
          <h1 className='scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl'>{name}</h1>
          <div className='docs-nav flex items-center gap-2'>
            <div className='hidden sm:block'>
              <div className='bg-secondary relative flex rounded-lg *:[[data-slot=button]]:focus-visible:relative *:[[data-slot=button]]:focus-visible:z-10'>
                <ButtonGroup>
                  <Button size='sm' variant='secondary' onClick={() => copy(markdown)}>
                    {copied ? <IconCheck /> : <IconCopy />}
                    Copy Page
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-label='Open actions' size='icon-sm' variant='secondary'>
                        <IconChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-56 min-w-56'>
                      <DropdownMenuItem asChild>
                        <a
                          href={`${LINKS.SITE}/functions/${type}s/${name}.md`}
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          <IconMarkdown />
                          View as Markdown
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {Object.entries(PROMPT_LINKS).map(([key, value]) => (
                        <DropdownMenuItem asChild key={key}>
                          <a
                            href={getPromptUrl(
                              value.url,
                              `${LINKS.SITE}/functions/${type}s/${name}.md`
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
                  <Link href={previous}>
                    <IconArrowLeft />
                    <span className='sr-only'>Previous</span>
                  </Link>
                </Button>
              )}
              {next && (
                <Button asChild size='icon-sm' variant='secondary'>
                  <Link href={next}>
                    <span className='sr-only'>Next</span>
                    <IconArrowRight />
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

      <div className='flex flex-wrap gap-1.5'>
        <div className='h-3' />
        <Badge>
          {<categoryMeta.Icon />} {category}
        </Badge>
        <Badge>
          <IconFlame />
          {usage}
        </Badge>
        <Badge>
          {isTest ? <IconRosetteDiscountCheck /> : <IconRosetteDiscountCheckOff />}
          test coverage
        </Badge>
      </div>
    </div>
  );
};
