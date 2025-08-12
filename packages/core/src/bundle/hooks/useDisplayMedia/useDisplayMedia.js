import { useEffect, useRef, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
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
 * @param {boolean | MediaTrackConstraints} [options.audio] Whether to enable audio sharing
 * @param {boolean} [options.immediately=false] Whether to start immediately
 * @param {boolean | MediaTrackConstraints} [options.video] Whether to enable video sharing
 * @returns {UseDisplayMediaReturn} Object containing stream, sharing status and control methods
 *
 * @example
 * const { stream, sharing, start, stop } = useDisplayMedia(ref);
 *
 * @overload
 * @template Target The target video element
 * @param {boolean | MediaTrackConstraints} [options.audio] Whether to enable audio sharing
 * @param {boolean} [options.immediately=false] Whether to start immediately
 * @param {boolean | MediaTrackConstraints} [options.video] Whether to enable video sharing
 * @returns {UseDisplayMediaReturn & { ref: StateRef<HTMLVideoElement> }} Object containing stream, sharing status, control methods and ref
 *
 * @example
 * const { ref, stream, sharing, start, stop } = useDisplayMedia<HTMLVideoElement>();
 */
export const useDisplayMedia = (...params) => {
  const supported =
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    !!navigator.mediaDevices &&
    'getDisplayMedia' in navigator.mediaDevices;
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = params[1] ? params[1] : params[0];
  const immediately = options?.immediately ?? false;
  const [sharing, setSharing] = useState(false);
  const elementRef = useRef(null);
  const streamRef = useRef(null);
  const internalRef = useRefState();
  const stop = () => {
    if (!streamRef.current || !supported || !elementRef.current) return;
    setSharing(false);
    elementRef.current.srcObject = null;
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };
  const start = async () => {
    if (!supported || !elementRef.current) return;
    const displayMedia = await navigator.mediaDevices.getDisplayMedia({
      video: options?.video,
      audio: options?.audio
    });
    setSharing(true);
    streamRef.current = displayMedia;
    elementRef.current.srcObject = displayMedia;
    displayMedia.getTracks().forEach((track) => (track.onended = stop));
    return displayMedia;
  };
  useEffect(() => {
    if (!supported || (!target && !internalRef.state)) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    elementRef.current = element;
    if (!immediately) return;
    start();
    return () => {
      stop();
    };
  }, [target, internalRef.state]);
  if (target)
    return {
      stream: streamRef.current,
      sharing,
      supported,
      start,
      stop
    };
  return {
    stream: streamRef.current,
    sharing,
    supported,
    start,
    stop,
    ref: internalRef
  };
};
