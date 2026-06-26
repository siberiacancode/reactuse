'use client';

import { useCycleList } from '@siberiacancode/reactuse';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRef } from 'react';

import { cn } from '@/utils/lib';

const TOYS = [
  {
    emoji: '🧸',
    name: 'Teddy Bear',
    tag: 'Plush',
    description: 'A soft and cuddly companion for cozy nights and big adventures.'
  },
  {
    emoji: '🧩',
    name: 'Puzzle Set',
    tag: 'Learning',
    description: 'Colorful pieces that build focus, patience and problem-solving skills.'
  },
  {
    emoji: '🪀',
    name: 'Classic Yo-Yo',
    tag: 'Skill',
    description: 'A timeless toy for tricks and improving hand-eye coordination.'
  },
  {
    emoji: '🚂',
    name: 'Wooden Train',
    tag: 'Wooden',
    description: 'A sturdy hand-crafted train that rolls straight into imaginative play.'
  },
  {
    emoji: '🪁',
    name: 'Sky Kite',
    tag: 'Outdoor',
    description: 'Catch the wind and watch it soar high on bright sunny afternoons.'
  }
];

const LENGTH = TOYS.length;

const ringOffset = (from: number, to: number) => {
  const diff = (((to - from) % LENGTH) + LENGTH) % LENGTH;
  return diff > LENGTH / 2 ? diff - LENGTH : diff;
};

const Demo = () => {
  const cycleList = useCycleList(TOYS);
  const prevOffsetsRef = useRef<Record<number, number>>({});

  return (
    <section className='flex w-full max-w-full flex-col items-center gap-5 p-4'>
      <div className='flex w-full items-center gap-2'>
        <button
          aria-label='Previous toy'
          className='size-9! shrink-0 rounded-full! p-0! shadow-md'
          data-variant='outline'
          type='button'
          onClick={() => cycleList.prev()}
        >
          <ChevronLeftIcon className='size-5' />
        </button>

        <div className='relative h-90 flex-1 overflow-hidden'>
          {TOYS.map((toy, cardIndex) => {
            const offset = ringOffset(cycleList.index, cardIndex);
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 1;

            const prevOffset = prevOffsetsRef.current[cardIndex];
            const jumped = prevOffset !== undefined && Math.abs(offset - prevOffset) > 1;
            prevOffsetsRef.current[cardIndex] = offset;

            return (
              <div
                key={toy.name}
                className={cn(
                  'absolute top-1/2 left-1/2 flex h-80 w-62 cursor-pointer flex-col items-center gap-4 rounded-2xl p-6 text-center ease-out',
                  jumped ? 'duration-0' : 'transition-all duration-500',
                  isActive ? 'bg-card shadow-lg' : 'bg-card/60'
                )}
                style={{
                  transform: `translate(-50%, -50%) translateX(${offset * 105}%) scale(${
                    isActive ? 1 : 0.85
                  })`,
                  transformOrigin: 'center center',
                  opacity: isVisible ? (isActive ? 1 : 0.35) : 0,
                  zIndex: 20 - Math.abs(offset),
                  pointerEvents: isVisible ? 'auto' : 'none'
                }}
                aria-label={`Show ${toy.name}`}
                onClick={() => {
                  if (!isActive) cycleList.go(cardIndex);
                }}
              >
                <div className='bg-muted flex size-24 shrink-0 items-center justify-center rounded-2xl text-5xl'>
                  {toy.emoji}
                </div>
                <div className='flex flex-col items-center gap-2'>
                  <span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase'>
                    {toy.tag}
                  </span>
                  <h3 className='text-foreground text-lg font-semibold'>{toy.name}</h3>
                  <p className='text-muted-foreground text-sm leading-relaxed'>{toy.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          aria-label='Next toy'
          className='size-9! shrink-0 rounded-full! p-0! shadow-md'
          data-variant='outline'
          type='button'
          onClick={() => cycleList.next()}
        >
          <ChevronRightIcon className='size-5' />
        </button>
      </div>

      <div className='flex items-center gap-2'>
        {TOYS.map((toy, dotIndex) => (
          <span
            key={toy.name}
            className={cn(
              'size-2 cursor-pointer rounded-full transition-colors',
              dotIndex === cycleList.index ? 'bg-foreground' : 'bg-muted-foreground/30'
            )}
            aria-label={`Go to ${toy.name}`}
            role='button'
            onClick={() => cycleList.go(dotIndex)}
          />
        ))}
      </div>
    </section>
  );
};

export default Demo;
