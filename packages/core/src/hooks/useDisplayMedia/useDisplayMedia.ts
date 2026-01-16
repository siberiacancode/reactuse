import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use display media return type */
export interface UseDisplayMediaReturn {
  /** Whether screen sharing is currently active */
  sharing: boolean;
  /** The media stream object */
  stream: MediaStream | null;
  /** Whether the display media API is supported */
  supported: boolean;
  /** Start screen sharing */
  start: () => Promise<void>;
  /** Stop screen sharing */
  stop: () => void;
}

/** The use display media options type */
export interface UseDisplayMediaOptions {
  /** Whether to enable audio sharing */
  audio?: boolean | MediaTrackConstraints;
  /** Whether to start immediately */
  immediately?: boolean;
  /** Whether to enable video sharing */
  video?: boolean | MediaTrackConstraints;
}

export interface UseDisplayMedia {
  (target: HookTarget, options?: UseDisplayMediaOptions): UseDisplayMediaReturn;

  <Target extends HTMLVideoElement>(
    options?: UseDisplayMediaOptions,
    target?: never
  ): { ref: StateRef<Target> } & UseDisplayMediaReturn;
}

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
export const useDisplayMedia = ((...params: any[]) => {
  const supported =
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    !!navigator.mediaDevices &&
    'getDisplayMedia' in navigator.mediaDevices;
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (params[1] ? params[1] : params[0]) as UseDisplayMediaOptions | undefined;
  const immediately = options?.immediately ?? false;

  const [sharing, setSharing] = useState(false);

  const elementRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>(null);
  const internalRef = useRefState<Element>();

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

    const element = (
      target ? isTarget.getElement(target) : internalRef.current
    ) as HTMLVideoElement;

    if (!element) return;

    elementRef.current = element;

    if (!immediately) return;

    start();

    return () => {
      stop();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

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
}) as UseDisplayMedia;
