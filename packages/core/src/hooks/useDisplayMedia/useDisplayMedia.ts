import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use display media constraints type */
export interface UseDisplayMediaConstraints {
  /** Whether to enable audio sharing */
  audio?: boolean | MediaTrackConstraints;
  /** Whether to enable video sharing */
  video?: boolean | MediaTrackConstraints;
}

/** The use display media return type */
export interface UseDisplayMediaReturn {
  /** Whether screen sharing is currently active */
  active: boolean;
  /** The media stream object */
  stream: MediaStream | null;
  /** Whether the display media API is supported */
  supported: boolean;
  /** Start screen sharing */
  start: (constraints?: UseDisplayMediaConstraints) => Promise<MediaStream | undefined>;
  /** Stop screen sharing */
  stop: () => void;
}

/** The use display media options type */
export interface UseDisplayMediaOptions {
  /** Default constraints to be passed to `getDisplayMedia` on the first request */
  constraints?: UseDisplayMediaConstraints;
  /** Whether to start immediately */
  immediately?: boolean;
  /** The callback fired once screen sharing starts */
  onStart?: (stream: MediaStream) => void;
  /** The callback fired when screen sharing stops */
  onStop?: (stream?: MediaStream) => void;
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
export const useDisplayMedia = ((...params: any[]) => {
  const supported =
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    !!navigator.mediaDevices &&
    'getDisplayMedia' in navigator.mediaDevices &&
    !!navigator.mediaDevices.getDisplayMedia;
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (params[1] ? params[1] : params[0]) as UseDisplayMediaOptions | undefined;
  const immediately = options?.immediately ?? false;

  const [active, setActive] = useState(false);

  const elementRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>(null);
  const internalRef = useRefState<Element>();
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const constraintsRef = useRef<UseDisplayMediaConstraints>({
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

  const start = async (constraints?: UseDisplayMediaConstraints) => {
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

    const element = (
      target ? isTarget.getElement(target) : internalRef.current
    ) as HTMLVideoElement;

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
}) as UseDisplayMedia;
