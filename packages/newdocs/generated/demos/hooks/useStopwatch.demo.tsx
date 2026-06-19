'use client'

import { useStopwatch } from '@siberiacancode/reactuse';
import { PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TICKS = 60;

const pad = (value: number) => String(value).padStart(2, '0');

const Demo = () => {
  const stopwatch = useStopwatch();
  const running = !stopwatch.paused;

  const secondInMinute = stopwatch.count % 60;
  const progress = secondInMinute / 60;
  const dashoffset = CIRCUMFERENCE * (1 - progress);

  const animate = secondInMinute !== 0;

  const onReset = () => {
    stopwatch.pause();
    stopwatch.reset();
  };

  return (
    <section className='flex w-full max-w-xs flex-col items-center gap-8 p-6'>
      <div className='relative' style={{ width: SIZE, height: SIZE }}>
        <svg className='-rotate-90' height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE}>
          {Array.from({ length: TICKS }).map((_, i) => {
            const angle = (i / TICKS) * 2 * Math.PI;
            const major = i % 5 === 0;
            const outer = RADIUS - 8;
            const inner = outer - (major ? 7 : 4);
            const x1 = CENTER + outer * Math.cos(angle);
            const y1 = CENTER + outer * Math.sin(angle);
            const x2 = CENTER + inner * Math.cos(angle);
            const y2 = CENTER + inner * Math.sin(angle);
            return (
              <line
                key={i}
                className='stroke-muted-foreground/25'
                strokeLinecap='round'
                strokeWidth={major ? 2.5 : 1.5}
                x1={x1}
                x2={x2}
                y1={y1}
                y2={y2}
              />
            );
          })}

          <circle
            className='stroke-muted/60'
            cx={CENTER}
            cy={CENTER}
            fill='none'
            r={RADIUS}
            strokeWidth={9}
          />

          <circle
            className={cn(
              'stroke-primary',
              animate && 'transition-[stroke-dashoffset] duration-1000 ease-linear'
            )}
            cx={CENTER}
            cy={CENTER}
            fill='none'
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashoffset}
            strokeLinecap='round'
            strokeWidth={9}
          />
        </svg>

        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-foreground font-mono text-3xl font-light tracking-tight tabular-nums'>
            {pad(stopwatch.hours)}:{pad(stopwatch.minutes)}:{pad(stopwatch.seconds)}
          </span>
          <span className='text-muted-foreground mt-1 text-[10px] tracking-[0.2em] uppercase'>
            {running ? 'Running' : stopwatch.count > 0 ? 'Paused' : 'Stopwatch'}
          </span>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <button
          aria-label='Reset'
          className='rounded-full!'
          data-size='icon-lg'
          data-variant='ghost'
          disabled={stopwatch.count === 0 && stopwatch.paused}
          type='button'
          onClick={onReset}
        >
          <RotateCcwIcon className='size-5' />
        </button>

        <button
          aria-label={running ? 'Pause' : 'Start'}
          className='size-14! rounded-full!'
          data-size='icon-lg'
          data-variant={running ? 'secondary' : 'default'}
          type='button'
          onClick={() => stopwatch.toggle()}
        >
          {running ? (
            <PauseIcon className='size-5' fill='currentColor' />
          ) : (
            <PlayIcon className='size-5 translate-x-0.5' fill='currentColor' />
          )}
        </button>

        <span aria-hidden className='size-9' />
      </div>
    </section>
  );
};

export default Demo;
