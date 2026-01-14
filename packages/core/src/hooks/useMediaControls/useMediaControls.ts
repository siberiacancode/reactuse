import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

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
    setPlaying(false);
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
  }, [target, internalRef.state, isTarget.getRefState(target)]);

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
