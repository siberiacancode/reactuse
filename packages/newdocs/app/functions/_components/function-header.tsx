'use client';

import { Callout } from '@docs/components/callout';
import { timeAgo } from '@docs/lib/utils';
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
  IconBrandOpenai,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconFlame,
  IconMarkdown,
  IconRosetteDiscountCheck,
  IconRosetteDiscountCheckOff,
  IconSparkles
} from '@tabler/icons-react';
import Link from 'next/link';

import { CATEGORIES } from '../_constants/categories';
import { USAGE } from '../_constants/usage';

interface FunctionHeaderProps {
  category?: string;
  description?: string;
  isDemo?: boolean;
  isTest?: boolean;
  name: string;
  next?: string;
  page: string;
  previous?: string;
  type?: string;
  usage?: string;
}

export const FunctionHeader = ({
  category,
  type,
  description,
  name,
  next,
  page,
  previous
}: FunctionHeaderProps) => {
  const { copy, copied } = useCopy();

  //   const categoryMeta = CATEGORIES[category as Category];
  //   const badgeBaseClass =
  //     'border-0 px-3 py-1 text-sm font-medium shadow-none [&_svg]:size-3.5 [&_svg]:opacity-80';

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between md:items-start'>
          <h1 className='scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl'>{name}</h1>
          <div className='docs-nav flex items-center gap-2'>
            <div className='hidden sm:block'>
              <div className='bg-secondary relative flex rounded-lg *:[[data-slot=button]]:focus-visible:relative *:[[data-slot=button]]:focus-visible:z-10'>
                <ButtonGroup>
                  <Button variant='secondary' onClick={() => copy(page)}>
                    {copied ? <IconCheck /> : <IconCopy />}
                    Copy Page
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-label='Open actions' variant='secondary'>
                        <IconChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-56 min-w-56'>
                      <DropdownMenuItem asChild>
                        <a
                          href={`/functions/${type}s/${name}.md`}
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          <IconMarkdown />
                          View as Markdown
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                        <IconSparkles />
                        Open in v0
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                        <IconBrandOpenai />
                        Open in ChatGPT
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                        <IconSparkles />
                        Open in Claude
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                        <IconSparkles />
                        Open in Scira
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ButtonGroup>
              </div>
            </div>
            <div className='ml-auto flex gap-2'>
              {previous && (
                <Button
                  asChild
                  className='extend-touch-target size-8 shadow-none md:size-7'
                  size='icon'
                  variant='secondary'
                >
                  <Link href={previous}>
                    <IconArrowLeft />
                    <span className='sr-only'>Previous</span>
                  </Link>
                </Button>
              )}
              {next && (
                <Button
                  asChild
                  className='extend-touch-target size-8 shadow-none md:size-7'
                  size='icon'
                  variant='secondary'
                >
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
      {/* 
      <div className='flex flex-wrap gap-3'>
        <Badge
          className={`${badgeBaseClass} ${
            categoryMeta.className ??
            'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
          }`}
        >
          {categoryMeta && <categoryMeta.Icon />}
          {categoryKey}
        </Badge>
        <Badge
          className={`${badgeBaseClass} ${
            props.usage
              ? usageMap[props.usage]
              : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
          }`}
        >
          <IconFlame />
          {props.usage}
        </Badge>
        <Badge className={badgeBaseClass}>
          {props.hasTests ? <IconRosetteDiscountCheck /> : <IconRosetteDiscountCheckOff />}
          test coverage
        </Badge>
      </div>

      <p className='leading-7'>Last changed: {timeAgo(props.lastModified)}</p>

      {props.warning && (
        <Callout className='border-yellow-600 bg-yellow-100 dark:border-yellow-400 dark:bg-yellow-900'>
          <h4 className='text-l font-semibold'>Important</h4>
          {props.warning}
        </Callout>
      )}

      {props.browserapi && (
        <Callout className='border-blue-600 bg-blue-100 dark:border-blue-400 dark:bg-blue-900'>
          <h4 className='text-l font-semibold'>TIP</h4>
          This hook uses {props.browserapi} browser api to provide enhanced functionality. Make sure
          to check for compatibility with different browsers when using this api
        </Callout>
      )} */}
    </div>
  );
};
