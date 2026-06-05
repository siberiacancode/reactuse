'use client';

import { useRefState, StateRef, isTarget } from '@siberiacancode/reactuse';
import {
  DownloadIcon,
  HeartIcon,
  MoreHorizontalIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/lib';

export const timeRangeToArray = (timeRanges: TimeRanges) => {
  let ranges: [number, number][] = [];

  for (let i = 0; i < timeRanges.length; ++i)
    ranges = [...ranges, [timeRanges.start(i), timeRanges.end(i)]];

  return ranges;
};

/** The media source configuration type */
export interface UseMediaSource {
  /** The media attribute of the media */
  media?: string;
  /** The source URL of the media */
  src: string;
  /** The MIME type of the media */
  type?: string;
}

/** The media controls return type */
export interface UseMediaControlsReturn {
  /** Whether the media is currently buffering */
  buffered: [number, number][];
  /** The current playback position in seconds */
  currentTime: number;
  /** The total duration of the media in seconds */
  duration: number;
  /** Whether the media has ended */
  ended: boolean;
  /** Whether the media is currently muted */
  muted: boolean;
  /** The current playback rate (1.0 is normal speed) */
  playbackRate: number;
  /** Whether the media is currently playing */
  playing: boolean;
  /** Whether the media is currently seeking */
  seeking: boolean;
  /** Whether the media is currently stalled */
  stalled: boolean;
  /** The current volume level (0.0 to 1.0) */
  volume: number;
  /** Whether the media is currently waiting */
  waiting: boolean;
  /** Set the playback rate */
  changePlaybackRate: (rate: number) => void;
  /** Set the volume level (0.0 to 1.0) */
  changeVolume: (volume: number) => void;
  /** Set the muted state */
  mute: () => void;
  /** Pause the media */
  pause: () => void;
  /** Start playing the media */
  play: () => Promise<void>;
  /** Seek to a specific time in seconds */
  seek: (time: number) => void;
  /** Toggle between play and pause */
  toggle: () => Promise<void>;
  /** Set the unmuted state */
  unmute: () => void;
}

export interface UseMediaControls {
  (target: HookTarget, src: string): UseMediaControlsReturn;

  (target: HookTarget, options: UseMediaSource): UseMediaControlsReturn;

  <Target extends HTMLMediaElement>(
    src: string
  ): UseMediaControlsReturn & {
    ref: StateRef<Target>;
  };

  <Target extends HTMLMediaElement>(
    options: UseMediaSource
  ): UseMediaControlsReturn & { ref: StateRef<Target> };
}

/**
 * @name useMediaControls
 * @description Hook that provides controls for HTML media elements (audio/video)
 * @category Browser
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target media element
 * @param {string} src The source URL of the media
 * @returns {UseMediaControlsReturn} An object containing media controls and state
 *
 * @example
 * const { playing, play, pause } = useMediaControls(videoRef, 'video.mp4');
 *
 * @overload
 * @param {HookTarget} target The target media element
 * @param {UseMediaSource} options The media source configuration
 * @returns {UseMediaControlsReturn} An object containing media controls and state
 *
 * @example
 * const { playing, play, pause } = useMediaControls(audioRef, { src: 'audio.mp3', type: 'audio/mp3' });
 *
 * @overload
 * @template Target The target media element type
 * @param {string} src The source URL of the media
 * @returns {UseMediaControlsReturn & { ref: StateRef<Target> }} An object containing media controls, state and ref
 *
 * @example
 * const { ref, playing, play, pause } = useMediaControls<HTMLVideoElement>('video.mp4');
 *
 * @overload
 * @template Target The target media element type
 * @param {UseMediaSource} options The media source configuration
 * @returns {UseMediaControlsReturn & { ref: StateRef<Target> }} An object containing media controls, state and ref
 *
 * @example
 * const { ref, playing, play, pause } = useMediaControls<HTMLVideoElement>({ src: 'video.mp4', type: 'video/mp4' });
 */
export const useMediaControls = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { src: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { src: params[0] }
  ) as UseMediaSource;

  const internalRef = useRefState<HTMLMediaElement>();
  const elementRef = useRef<HTMLMediaElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [buffered, setBuffered] = useState<[number, number][]>([]);
  const [stalled, setStalled] = useState(false);
  const [ended, setEnded] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);

  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(1);

  useEffect(() => {
    const element = (
      target ? isTarget.getElement(target) : internalRef.current
    ) as HTMLMediaElement;

    if (!element) return;

    elementRef.current = element;
    element.src = options.src;

    if (options.type) element.setAttribute('type', options.type);
    if (options.media) element.setAttribute('media', options.media);

    setDuration(element.duration);
    setCurrentTime(element.currentTime);
    setEnded(element.ended);
    setMutedState(element.muted);
    setVolumeState(element.volume);
    setPlaybackRateState(element.playbackRate);

    const onPlaying = () => {
      setPlaying(true);
      setStalled(false);
    };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setWaiting(true);
    const onStalled = () => setStalled(true);
    const onSeeking = () => setSeeking(true);
    const onSeeked = () => setSeeking(false);
    const onEnded = () => {
      setPlaying(false);
      setEnded(true);
    };
    const onDurationChange = () => setDuration(element.duration);
    const onTimeUpdate = () => setCurrentTime(element.currentTime);
    const onVolumechange = () => {
      setMutedState(element.muted);
      setVolumeState(element.volume);
    };
    const onRatechange = () => setPlaybackRateState(element.playbackRate);
    const onProgress = () => setBuffered(timeRangeToArray(element.buffered));

    element.addEventListener('playing', onPlaying);
    element.addEventListener('pause', onPause);
    element.addEventListener('waiting', onWaiting);
    element.addEventListener('progress', onProgress);
    element.addEventListener('stalled', onStalled);
    element.addEventListener('seeking', onSeeking);
    element.addEventListener('seeked', onSeeked);
    element.addEventListener('ended', onEnded);
    element.addEventListener('loadedmetadata', onDurationChange);
    element.addEventListener('timeupdate', onTimeUpdate);
    element.addEventListener('volumechange', onVolumechange);
    element.addEventListener('ratechange', onRatechange);

    if (playing) element.play();

    return () => {
      element.removeEventListener('playing', onPlaying);
      element.removeEventListener('pause', onPause);
      element.removeEventListener('waiting', onWaiting);
      element.removeEventListener('progress', onProgress);
      element.removeEventListener('stalled', onStalled);
      element.removeEventListener('seeking', onSeeking);
      element.removeEventListener('seeked', onSeeked);
      element.removeEventListener('ended', onEnded);
      element.removeEventListener('loadedmetadata', onDurationChange);
      element.removeEventListener('timeupdate', onTimeUpdate);
      element.removeEventListener('volumechange', onVolumechange);
      element.removeEventListener('ratechange', onRatechange);
    };
  }, [
    target && isTarget.getRawElement(target),
    internalRef.state,
    options.src,
    options.type,
    options.media
  ]);

  const play = async () => {
    const element = elementRef.current;
    if (!element) return;

    await element.play();
  };

  const pause = () => {
    if (!elementRef.current) return;
    elementRef.current.pause();
  };

  const toggle = async (value = !playing) => {
    if (value) return play();
    return pause();
  };

  const seek = (time: number) => {
    if (!elementRef.current) return;
    elementRef.current.currentTime = Math.min(Math.max(time, 0), duration);
  };

  const changeVolume = (value: number) => {
    if (!elementRef.current) return;
    elementRef.current.volume = Math.min(Math.max(value, 0), 1);
  };

  const mute = () => {
    if (!elementRef.current) return;
    elementRef.current.muted = true;
  };

  const unmute = () => {
    if (!elementRef.current) return;
    elementRef.current.muted = false;
  };

  const changePlaybackRate = (value: number) => {
    if (!elementRef.current) return;
    elementRef.current.playbackRate = value;
  };

  return {
    playing,
    duration,
    currentTime,
    seeking,
    waiting,
    buffered,
    stalled,
    ended,
    playbackRate,
    muted,
    volume,
    play,
    pause,
    toggle,
    seek,
    changeVolume,
    mute,
    unmute,
    changePlaybackRate,

    ...(!target && { ref: internalRef })
  };
}) as UseMediaControls;

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

  const onSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    audio.seek(ratio * audio.duration);
  };

  return (
    <section className='flex w-full max-w-xs flex-col gap-4 p-4'>
      <audio ref={audio.ref} />

      <div
        className={cn(
          'relative flex aspect-square w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-4 shadow-lg',
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

      <div className='flex flex-col gap-0.5'>
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
    </section>
  );
};

export default Demo;
