'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/src/components/ui';
import { cn } from '@/src/lib';

interface Contributor {
  avatar: string;
  name: string;
}

interface LandingContributorsProps {
  contributors: Contributor[];
}

const INITIAL_COUNT = 64;

const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

export const LandingContributors = ({ contributors }: LandingContributorsProps) => {
  const [showAll, toggleShowAll] = useBoolean();
  const hasMore = contributors.length > INITIAL_COUNT;

  return (
    <section>
      <div className='mx-auto max-w-6xl px-6 py-12 md:py-24'>
        <div className='mb-12 max-w-2xl'>
          <h2 className='font-display text-foreground text-4xl font-bold tracking-tight uppercase md:text-8xl'>
            Contributors
          </h2>
          <p className='text-muted-foreground mt-6 text-lg leading-relaxed md:text-xl'>
            <span className='text-foreground font-semibold'>Built by the community.</span> reactuse
            is an open-source project maintained by{' '}
            <span className='text-foreground font-semibold'>{contributors.length}</span> developers
            around the world. Every hook, fix and doc is a contribution —{' '}
            <Link
              className='text-foreground inline-flex items-center gap-0.5 font-medium underline underline-offset-4'
              href='/docs/contributing'
              rel='noreferrer'
              target='_blank'
            >
              read the contribute guide
              <ArrowUpRight className='size-4' />
            </Link>
            .
          </p>
        </div>

        <div className='relative'>
          {/* animated collapsible grid */}
          <div
            className={cn(
              'overflow-hidden transition-[max-height] duration-700 ease-in-out',
              showAll ? 'max-h-[4000px]' : 'max-h-72'
            )}
          >
            <TooltipProvider delayDuration={100}>
              <div className='flex flex-wrap gap-2.5'>
                {contributors.map((contributor) => (
                  <Tooltip key={contributor.name}>
                    <TooltipTrigger asChild>
                      <Link
                        className='transition-transform hover:z-10 hover:scale-110'
                        href={`https://github.com/${contributor.name}`}
                        rel='noreferrer'
                        target='_blank'
                      >
                        <Avatar className='border-border size-12 border'>
                          <AvatarImage alt={contributor.name} src={contributor.avatar} />
                          <AvatarFallback className='bg-muted text-muted-foreground text-xs font-medium'>
                            {getInitials(contributor.name)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side='top'>{contributor.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* overlay with centered ghost button (only while collapsed) */}
          {hasMore && !showAll && (
            <div className='absolute inset-x-0 bottom-0 flex h-32 items-center justify-center'>
              <div className='from-background via-background/80 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent' />
              <Button
                className='relative rounded-full px-6'
                variant='ghost'
                onClick={() => toggleShowAll()}
              >
                Show all {contributors.length}
              </Button>
            </div>
          )}
        </div>

        {showAll && (
          <div className='mt-8 flex justify-center'>
            <Button className='rounded-full px-6' variant='ghost' onClick={() => toggleShowAll()}>
              Show less
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
