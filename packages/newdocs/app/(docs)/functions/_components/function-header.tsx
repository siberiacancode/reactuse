'use client';

import { Badge } from '@docs/src/components/ui/badge';
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
  BadgeCheckIcon,
  BadgeXIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  FileTextIcon,
  FlameIcon
} from 'lucide-react';
import Link from 'next/link';

import { LINKS, PROMPT_LINKS } from '@/src/constants';
import { getPromptUrl } from '@/src/utils/helpers';

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
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    Copy Page
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button aria-label='Open actions' size='icon-sm' variant='secondary' />
                      }
                    >
                      <ChevronDownIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-56 min-w-56'>
                      <DropdownMenuItem
                        render={
                          <a
                            href={`${LINKS.SITE}/functions/${type}s/${name}.md`}
                            rel='noopener noreferrer'
                            target='_blank'
                          />
                        }
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
                              href={getPromptUrl(
                                value.url,
                                `${LINKS.SITE}/functions/${type}s/${name}.md`
                              )}
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
          <FlameIcon />
          {usage}
        </Badge>
        <Badge>
          {isTest ? <BadgeCheckIcon /> : <BadgeXIcon />}
          test coverage
        </Badge>
      </div>
    </div>
  );
};
