import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
export const timeRangeToArray = (timeRanges) => {
  let ranges = [];
  for (let i = 0; i < timeRanges.length; ++i)
    ranges = [...ranges, [timeRanges.start(i), timeRanges.end(i)]];
  return ranges;
};
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
export const useMediaControls = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target
    ? typeof params[1] === 'object'
      ? params[1]
      : { src: params[1] }
    : typeof params[0] === 'object'
      ? params[0]
      : { src: params[0] };
  const internalRef = useRefState();
  const elementRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [buffered, setBuffered] = useState([]);
  const [stalled, setStalled] = useState(false);
  const [ended, setEnded] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(1);
  useEffect(() => {
    const element = target ? isTarget.getElement(target) : internalRef.current;
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
  const seek = (time) => {
    if (!elementRef.current) return;
    elementRef.current.currentTime = Math.min(Math.max(time, 0), duration);
  };
  const changeVolume = (value) => {
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
  const changePlaybackRate = (value) => {
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
};
