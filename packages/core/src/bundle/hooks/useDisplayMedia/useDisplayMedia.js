import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useDisplayMedia
 * @description - Hook that provides screen sharing functionality
 * @category Browser
 * @usage low
 *
 * @browserapi mediaDevices.getDisplayMedia https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
 *
 * @overload
 * @param {HookTarget} target The target video element to display the media stream
 * @param {UseDisplayMediaConstraints} [options.constraints] Default constraints passed to `getDisplayMedia`
 * @param {boolean} [options.immediately=false] Whether to start immediately
 * @param {(stream: MediaStream) => void} [options.onStart] Callback fired when screen sharing starts
 * @param {(stream?: MediaStream) => void} [options.onStop] Callback fired when screen sharing stops
 * @returns {UseDisplayMediaReturn} Object containing stream, active status and control methods
 *
 * @example
 * const { stream, active, start, stop } = useDisplayMedia(ref);
 * start({ video: false, audio: true });
 *
 * @overload
 * @template Target The target video element
 * @param {UseDisplayMediaConstraints} [options.constraints] Default constraints passed to `getDisplayMedia`
 * @param {boolean} [options.immediately=false] Whether to start immediately
 * @param {(stream: MediaStream) => void} [options.onStart] Callback fired when screen sharing starts
 * @param {(stream?: MediaStream) => void} [options.onStop] Callback fired when screen sharing stops
 * @returns {UseDisplayMediaReturn & { ref: StateRef<HTMLVideoElement> }} Object containing stream, active status, control methods and ref
 *
 * @example
 * const { ref, stream, active, start, stop } = useDisplayMedia<HTMLVideoElement>();
 * start({ video: { displaySurface: 'browser' } });
 */
export const useDisplayMedia = (...params) => {
  const supported =
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    !!navigator.mediaDevices &&
    'getDisplayMedia' in navigator.mediaDevices &&
    !!navigator.mediaDevices.getDisplayMedia;
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = params[1] ? params[1] : params[0];
  const immediately = options?.immediately ?? false;
  const [active, setActive] = useState(false);
  const elementRef = useRef(null);
  const streamRef = useRef(null);
  const internalRef = useRefState();
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const constraintsRef = useRef({
    video: options?.constraints?.video ?? true,
    audio: options?.constraints?.audio ?? false
  });
  const cleanup = () => {
    if (elementRef.current) elementRef.current.srcObject = null;
    if (!streamRef.current) return;
    streamRef.current.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });
    streamRef.current = null;
  };
  const stop = () => {
    if (!supported || !streamRef.current) return;
    const stream = streamRef.current;
    setActive(false);
    optionsRef.current?.onStop?.(stream);
    cleanup();
  };
  const start = async (constraints) => {
    if (!supported || !elementRef.current) return;
    if (constraints) {
      constraintsRef.current = constraints;
      cleanup();
    }
    const displayMedia = await navigator.mediaDevices.getDisplayMedia({
      video: constraintsRef.current.video,
      audio: constraintsRef.current.audio
    });
    setActive(true);
    streamRef.current = displayMedia;
    elementRef.current.srcObject = displayMedia;
    optionsRef.current?.onStart?.(displayMedia);
    displayMedia.getTracks().forEach((track) => (track.onended = stop));
    return displayMedia;
  };
  useEffect(() => {
    if (!supported || (!target && !internalRef.state)) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    elementRef.current = element;
    if (immediately) start();
    return () => {
      cleanup();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);
  if (target)
    return {
      stream: streamRef.current,
      active,
      supported,
      start,
      stop
    };
  return {
    stream: streamRef.current,
    active,
    supported,
    start,
    stop,
    ref: internalRef
  };
};
