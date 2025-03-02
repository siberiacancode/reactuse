import type { RefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

import { getElement, isTarget } from '@/utils/helpers';

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
  enabled?: boolean;
  /** Whether to enable video sharing */
  video?: boolean | MediaTrackConstraints;
}

/** The use display media target type */
export type UseDisplayMediaTarget =
  | string
  | HTMLVideoElement
  | RefObject<HTMLVideoElement | null | undefined>;

export interface UseDisplayMediaOverload {
  <Target extends UseDisplayMediaTarget>(
    target: Target,
    options?: UseDisplayMediaOptions
  ): UseDisplayMediaReturn;

  <Target extends UseDisplayMediaTarget = HTMLVideoElement>(
    options?: UseDisplayMediaOptions,
    target?: Target
  ): { ref: StateRef<Target> } & UseDisplayMediaReturn;
}

/**
 * @name useDisplayMedia
 * @description - Hook that provides screen sharing functionality
 * @category Browser
 *
 * @browserapi mediaDevices.getDisplayMedia https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
 *
 * @overload
 * @template Target The target video element
 * @param {Target} target The target video element to display the media stream
 * @param {boolean | MediaTrackConstraints} [options.audio] Whether to enable audio sharing
 * @param {boolean} [options.enabled=false] Whether to start immediately
 * @param {boolean | MediaTrackConstraints} [options.video] Whether to enable video sharing
 * @returns {UseDisplayMediaReturn} Object containing stream, sharing status and control methods
 *
 * @example
 * const { stream, sharing, start, stop } = useDisplayMedia(ref);
 *
 * @overload
 * @template Target The target video element
 * @param {boolean | MediaTrackConstraints} [options.audio] Whether to enable audio sharing
 * @param {boolean} [options.enabled=false] Whether to start immediately
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
  const target = (isTarget(params[0]) ? params[0] : undefined) as UseDisplayMediaTarget | undefined;
  const options = (params[1] ? params[1] : params[0]) as UseDisplayMediaOptions | undefined;
  const enabled = options?.enabled ?? false;

  const [sharing, setSharing] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const internalRef = useRefState<Element>();

  const stop = () => {
    if (!streamRef.current || !supported) return;

    const element = (target ? getElement(target) : internalRef.current) as HTMLVideoElement;
    if (!element) return;

    setSharing(false);
    element.srcObject = null;
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const start = async () => {
    if (!supported) return;

    const element = (target ? getElement(target) : internalRef.current) as HTMLVideoElement;
    if (!element) return;

    const displayMedia = await navigator.mediaDevices.getDisplayMedia({
      video: options?.video,
      audio: options?.audio
    });

    setSharing(true);
    streamRef.current = displayMedia;
    element.srcObject = displayMedia;

    displayMedia.getTracks().forEach((track) => (track.onended = stop));
    return displayMedia;
  };

  useEffect(() => {
    if (!supported || !enabled) return;
    if (!target && !internalRef.state) return;

    const element = (target ? getElement(target) : internalRef.current) as HTMLVideoElement;
    if (!element) return;

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
}) as UseDisplayMediaOverload;
