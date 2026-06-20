'use client'

import { useMediaControls } from '@siberiacancode/reactuse';
import {
  DownloadIcon,
  HeartIcon,
  MoreHorizontalIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon
} from 'lucide-react';
import { useState } from 'react';
import type { MouseEvent } from 'react';

import { cn } from '@/utils/lib';

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const TRACKS = [
  {
    id: 1,
    title: 'useEffect at 3 AM',
    artist: 'The Hook Brothers',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    gradient: 'from-violet-500 to-fuchsia-700'
  },
  {
    id: 2,
    title: 'Stale Closure Blues',
    artist: 'Dependency Array',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    gradient: 'from-cyan-500 to-blue-700'
  },
  {
    id: 3,
    title: 'It Works on My Machine',
    artist: 'The Reducers',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    gradient: 'from-amber-500 to-rose-600'
  },
  {
    id: 4,
    title: 'Merge Conflict (feat. Git)',
    artist: 'Null & The Undefined',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    gradient: 'from-emerald-500 to-teal-700'
  }
] as const;

const Demo = () => {
  const [trackIndex, setTrackIndex] = useState(0);
  const track = TRACKS[trackIndex];

  const audio = useMediaControls<HTMLAudioElement>({ src: track.src, type: 'audio/mp3' });

  const onPrev = () => setTrackIndex((current) => (current - 1 + TRACKS.length) % TRACKS.length);
  const onNext = () => setTrackIndex((current) => (current + 1) % TRACKS.length);

  const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;

  const onSeek = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    audio.seek(ratio * audio.duration);
  };

  return (
    <section className='flex w-full max-w-xs flex-col gap-4 p-4 md:max-w-2xl'>
      <audio ref={audio.ref} />

      <div
        className={cn(
          'relative flex aspect-square w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-4 shadow-lg md:max-w-xs',
          track.gradient
        )}
      >
        <span className='text-xs font-medium tracking-[0.25em] text-white/70 uppercase'>
          Now playing
        </span>

        <div className='absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/50 to-transparent p-4 pt-12'>
          <button
            aria-label='Previous'
            className='flex size-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white'
            data-variant='unstyled'
            type='button'
            onClick={onPrev}
          >
            <SkipBackIcon className='size-5' />
          </button>
          <button
            aria-label={audio.playing ? 'Pause' : 'Play'}
            className='rounded-full!'
            type='button'
            onClick={() => {
              audio.changeVolume(0.2);
              audio.toggle();
            }}
          >
            {audio.playing ? (
              <PauseIcon className='size-5' fill='currentColor' />
            ) : (
              <PlayIcon className='size-5 translate-x-0.5' fill='currentColor' />
            )}
          </button>
          <button
            aria-label='Next'
            className='flex size-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white'
            data-variant='unstyled'
            type='button'
            onClick={onNext}
          >
            <SkipForwardIcon className='size-5' />
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-4 md:flex-row md:items-start md:gap-5'>
        <div className='flex min-w-0 flex-1 flex-col gap-4'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex min-w-0 flex-col leading-tight'>
              <span className='text-foreground truncate text-lg font-bold'>{track.title}</span>
              <span className='text-muted-foreground truncate text-xs'>{track.artist}</span>
            </div>
            <div className='flex shrink-0 items-center gap-1'>
              <button
                aria-label='Like'
                className='rounded-full!'
                data-size='icon'
                data-variant='ghost'
                type='button'
              >
                <HeartIcon className='size-4' />
              </button>
              <button
                aria-label='Download'
                className='rounded-full!'
                data-size='icon'
                data-variant='ghost'
                type='button'
              >
                <DownloadIcon className='size-4' />
              </button>
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <div
              className='group bg-muted relative h-1.5 w-full cursor-pointer rounded-full'
              onClick={onSeek}
            >
              <div
                className='bg-foreground absolute inset-y-0 left-0 rounded-full'
                style={{ width: `${progress}%` }}
              />
              <div
                className='bg-foreground absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 shadow transition-opacity group-hover:opacity-100'
                style={{ left: `${progress}%` }}
              />
            </div>
            <div className='text-muted-foreground flex justify-between font-mono text-[10px] tabular-nums'>
              <span>{formatTime(audio.currentTime)}</span>
              <span>{formatTime(audio.duration)}</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-0.5 md:w-52 md:shrink-0'>
          {TRACKS.map((item, index) => {
            const active = index === trackIndex;
            return (
              <div
                key={item.id}
                className='group hover:bg-muted/40 flex cursor-pointer gap-2 rounded-xl px-1 py-2'
                onClick={() => setTrackIndex(index)}
              >
                <div
                  className={cn(
                    'flex size-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
                    item.gradient
                  )}
                >
                  {active && audio.playing && (
                    <div className='flex items-center gap-0.5'>
                      <span className='h-2.5 w-0.5 animate-pulse rounded-full bg-white' />
                      <span className='h-1.5 w-0.5 animate-pulse rounded-full bg-white [animation-delay:150ms]' />
                      <span className='h-3 w-0.5 animate-pulse rounded-full bg-white [animation-delay:300ms]' />
                    </div>
                  )}
                </div>

                <div className='flex min-w-0 flex-1 flex-col gap-0.5 leading-tight'>
                  <span
                    className={cn(
                      'truncate text-sm font-medium',
                      active ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {item.title}
                  </span>
                  <span className='text-muted-foreground truncate text-xs'>{item.artist}</span>
                </div>

                <div className='mr-2 flex items-center'>
                  <MoreHorizontalIcon className='text-muted-foreground size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100' />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Demo;
