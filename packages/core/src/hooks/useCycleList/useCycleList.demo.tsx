import { useCycleList } from '@siberiacancode/reactuse';
import { PauseIcon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const TRACKS = [
  {
    title: 'Resistance',
    artist: 'Muse',
    accent: 'bg-cyan-400',
    cover: 'from-blue-950 via-indigo-700 to-rose-500',
    bars: [4, 8, 5, 9, 6, 12, 7, 10, 5, 8, 11, 6, 9, 4, 7, 12],
    current: 250,
    duration: 346
  },
  {
    title: 'Cold Start',
    artist: 'Deep Work',
    accent: 'bg-emerald-400',
    cover: 'from-emerald-950 via-teal-700 to-lime-400',
    bars: [8, 4, 10, 6, 12, 7, 5, 9, 11, 6, 4, 8, 12, 7, 9, 5],
    current: 68,
    duration: 252
  },
  {
    title: 'Diff Lights',
    artist: 'Review Flow',
    accent: 'bg-amber-400',
    cover: 'from-zinc-950 via-amber-700 to-orange-400',
    bars: [5, 11, 7, 4, 8, 12, 6, 10, 7, 5, 9, 12, 4, 8, 6, 10],
    current: 136,
    duration: 238
  },
  {
    title: 'Tag Cut',
    artist: 'Release Run',
    accent: 'bg-rose-400',
    cover: 'from-rose-950 via-fuchsia-800 to-sky-500',
    bars: [10, 6, 8, 12, 5, 9, 4, 7, 11, 8, 6, 12, 5, 10, 7, 4],
    current: 47,
    duration: 275
  }
];

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, '0')}`;
};

const Demo = () => {
  const { value: track, index, next, prev, go } = useCycleList(TRACKS);

  const progress = track.current / track.duration;
  const activeBars = Math.round(track.bars.length * progress);

  const goToRandomTrack = () => {
    let nextIndex: number;
    do {
      nextIndex = Math.floor(Math.random() * TRACKS.length);
    } while (nextIndex === index);

    go(nextIndex);
  };

  return (
    <section className='flex w-full max-w-sm flex-col items-center p-4'>
      <div className='relative w-full pb-16'>
        <div className='border-border bg-card relative z-10 flex min-h-[400px] flex-col items-center rounded-[2rem] border p-6 shadow-sm'>
          <div
            className={cn(
              'relative flex size-46 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br shadow-lg',
              track.cover
            )}
          >
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgb(0_0_0/0.28)_29%,transparent_55%)]' />
            <div className='absolute inset-6 rounded-full border-[18px] border-white/15' />
            <div className='absolute inset-14 rounded-full border-[14px] border-white/20' />
            <div className='absolute bottom-5 h-20 w-11 rounded-t-full bg-white/85' />
            <span className='absolute top-3 left-3 border-b-2 border-current font-mono text-xs font-bold tracking-tight text-white'>
              MIX
            </span>
          </div>

          <div className='mt-10 flex w-full min-w-0 flex-col items-center gap-1 text-center'>
            <h3 className='text-foreground max-w-full truncate text-3xl font-bold'>
              {track.title}
            </h3>
            <span className='text-muted-foreground max-w-full truncate text-base'>
              {track.artist}
            </span>
          </div>

          <div className='mt-auto mb-auto flex items-center justify-center gap-2'>
            {TRACKS.map((item, trackIndex) => (
              <button
                key={item.title}
                className={cn(
                  'size-2.5! rounded-full! p-0!',
                  trackIndex === index ? item.accent : 'bg-muted-foreground/40'
                )}
                aria-label={`Select ${item.title}`}
                data-variant='unstyled'
                type='button'
                onClick={() => go(trackIndex)}
              />
            ))}
          </div>

          <div className='flex w-full items-center justify-between gap-3'>
            <button
              aria-label='Repeat'
              data-size='icon-sm'
              data-variant='ghost'
              type='button'
              onClick={() => go(0)}
            >
              <RepeatIcon className='size-4' />
            </button>
            <button
              aria-label='Previous track'
              data-size='icon'
              data-variant='ghost'
              type='button'
              onClick={() => prev()}
            >
              <SkipBackIcon className='size-5' />
            </button>
            <button aria-label='Pause' className='size-16! rounded-full!' type='button'>
              <PauseIcon className='size-6' />
            </button>
            <button
              aria-label='Next track'
              data-size='icon'
              data-variant='ghost'
              type='button'
              onClick={() => next()}
            >
              <SkipForwardIcon className='size-5' />
            </button>
            <button
              aria-label='Shuffle'
              data-size='icon-sm'
              data-variant='ghost'
              type='button'
              onClick={goToRandomTrack}
            >
              <ShuffleIcon className='size-4' />
            </button>
          </div>
        </div>

        <div className='border-border bg-card absolute right-10 bottom-4 left-10 flex items-center gap-3 rounded-b-3xl border px-4 py-3 shadow-sm'>
          <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
            {formatTime(track.current)}
          </span>

          <div className='flex h-6 flex-1 items-center justify-center gap-1'>
            {track.bars.map((height, barIndex) => (
              <span
                key={barIndex}
                className={cn(
                  'w-0.5 rounded-full',
                  barIndex < activeBars ? track.accent : 'bg-muted-foreground/40'
                )}
                style={{ height: `${height * 2}px` }}
              />
            ))}
          </div>

          <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
            {formatTime(track.duration)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Demo;
