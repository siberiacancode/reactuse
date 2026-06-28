'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { ArrowUpRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
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
import { LINKS } from '@/src/constants';
import { cn } from '@/src/lib';

const INITIAL_COUNT = 64;

const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

export interface LandingContributor {
  avatar: string;
  name: string;
}

interface LandingContributorsProps {
  contributors: LandingContributor[];
}

export const LandingContributors = ({ contributors }: LandingContributorsProps) => {
  const [showAll, toggleShowAll] = useBoolean();
  const hasMore = contributors.length > INITIAL_COUNT;

  return (
    <section>
      <div className='w-full px-6 py-12 md:container md:mx-auto md:py-24'>
        <motion.div
          className='mb-12 max-w-2xl'
          initial={{ opacity: 0, y: -28 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.45 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className='font-display text-foreground text-4xl font-bold tracking-tight uppercase md:text-8xl'>
            Contributors
          </h2>
          <p className='text-muted-foreground mt-6 text-lg leading-relaxed md:text-xl'>
            <span className='text-foreground font-semibold'>Built by the community.</span> reactuse
            is an open-source project maintained by{' '}
            <span className='text-foreground font-semibold'>{contributors.length}</span> developers
            around the world. Every hook, fix and doc is a contribution.
          </p>
          <Link
            className='text-foreground mt-5 inline-flex items-center gap-1 font-medium underline underline-offset-4'
            href={LINKS.CONTRIBUTING}
            prefetch={false}
            rel='noreferrer'
            target='_blank'
          >
            Contribute
            <ArrowUpRightIcon className='size-4' />
          </Link>
        </motion.div>

        <motion.div
          className='relative'
          initial={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.2 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div
            className={cn(
              'overflow-hidden transition-[max-height] duration-700 ease-in-out',
              showAll ? 'max-h-[4000px]' : 'max-h-44 md:max-h-72'
            )}
          >
            <TooltipProvider delayDuration={100}>
              <div className='flex w-full flex-wrap justify-between gap-y-2.5 md:justify-start md:gap-2.5'>
                {contributors.map((contributor) => (
                  <Tooltip key={contributor.name}>
                    <TooltipTrigger asChild>
                      <div>
                        <Avatar className='border-border size-12 border'>
                          <AvatarImage alt={contributor.name} src={contributor.avatar} />
                          <AvatarFallback className='bg-muted text-muted-foreground text-xs font-medium'>
                            {getInitials(contributor.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side='top'>{contributor.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {hasMore && !showAll && (
            <div className='absolute inset-x-0 bottom-0 flex h-20 items-center justify-center md:h-32'>
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
        </motion.div>

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
