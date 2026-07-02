import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use media stream options type */
export interface UseMediaStreamOptions {
  /** Default constraints to be passed to `getUserMedia` on the first request */
  constraints?: MediaStreamConstraints;
  /** Whether the stream should be requested immediately */
  immediately?: boolean;
  /** The callback fired when requesting the stream fails */
  onError?: (error: Error) => void;
  /** The callback fired once the stream was successfully obtained */
  onStart?: (stream: MediaStream) => void;
  /** The callback fired when the stream is stopped */
  onStop?: (stream?: MediaStream) => void;
}

/** The use media stream return type */
export interface UseMediaStreamReturn {
  /** Whether a stream is currently active */
  active: boolean;
  /** Whether a stream is currently being requested */
  loading: boolean;
  /** The current media stream, if any */
  stream?: MediaStream;
  /** Whether `mediaDevices.getUserMedia` is supported by the browser */
  supported: boolean;
  /** Apply constraints to the live media tracks without recreating the stream */
  apply: (constraints: MediaStreamConstraints) => Promise<boolean>;
  /** Stop the current stream and request a new one with the current constraints */
  restart: () => Promise<MediaStream | undefined>;
  /** Request and start the media stream */
  start: (constraints?: MediaStreamConstraints) => Promise<MediaStream | undefined>;
  /** Stop all tracks of the current media stream */
  stop: () => void;
}

export interface UseMediaStream {
  (target: HookTarget, options?: UseMediaStreamOptions): UseMediaStreamReturn;

  (options?: UseMediaStreamOptions): UseMediaStreamReturn & {
    ref: StateRef<HTMLVideoElement>;
  };
}

/**
 * @name useMediaStream
 * @description - Hook that provides reactive access to a `mediaDevices.getUserMedia` stream
 * @category Browser
 * @usage medium
 *
 * @browserapi navigator.mediaDevices.getUserMedia https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 *
 * @overload
 * @param {HookTarget} target The target video element the stream will be attached to
 * @param {boolean} [options.immediately=false] Whether the stream should be requested immediately
 * @param {MediaStreamConstraints} [options.constraints] Default constraints passed to `getUserMedia`
 * @param {(stream: MediaStream) => void} [options.onStart] Callback fired when the stream starts
 * @param {(stream?: MediaStream) => void} [options.onStop] Callback fired when the stream stops
 * @param {(error: Error) => void} [options.onError] Callback fired when the request fails
 * @returns {UseMediaStreamReturn} An object containing the media stream state and controls
 *
 * @example
 * const { stream, start, apply, stop } = useMediaStream(videoRef, { immediately: true });
 *
 * @overload
 * @param {boolean} [options.immediately=false] Whether the stream should be requested immediately
 * @param {MediaStreamConstraints} [options.constraints] Default constraints passed to `getUserMedia`
 * @param {(stream: MediaStream) => void} [options.onStart] Callback fired when the stream starts
 * @param {(stream?: MediaStream) => void} [options.onStop] Callback fired when the stream stops
 * @param {(error: Error) => void} [options.onError] Callback fired when the request fails
 * @returns {UseMediaStreamReturn & { ref: StateRef<HTMLVideoElement> }} An object containing the media stream state, controls and ref
 *
 * @example
 * const { ref, stream, start, apply, stop } = useMediaStream({ immediately: true });
 */
export const useMediaStream = ((...params: any[]) => {
  const supported =
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    !!navigator.mediaDevices &&
    'getUserMedia' in navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia;

  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = ((target ? params[1] : params[0]) as UseMediaStreamOptions) ?? {};

  const [active, setActive] = useState(options.immediately ?? false);
  const [loading, setLoading] = useState(false);

  const internalRef = useRefState<HTMLVideoElement>();
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const streamRef = useRef<MediaStream>(undefined);
  const constraintsRef = useRef<MediaStreamConstraints>(
    options.constraints ?? {
      video: true,
      audio: true
    }
  );

  const elementRef = useRef<HTMLMediaElement | null>(null);

  const attach = (mediaStream: MediaStream) => {
    if (!elementRef.current) return;
    elementRef.current.srcObject = mediaStream;
  };

  const cleanup = () => {
    if (!elementRef.current) return;
    elementRef.current.srcObject = null;
    if (!streamRef.current) return;
    streamRef.current.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });
    streamRef.current = undefined;
  };

  const stop = () => {
    setActive(false);
    optionsRef.current.onStop?.(streamRef.current);
    cleanup();
  };

  const start = async (constraints?: MediaStreamConstraints) => {
    if (!supported) return;

    if (constraints) {
      constraintsRef.current = constraints;
      cleanup();
    }

    try {
      setLoading(true);

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraintsRef.current);

      mediaStream.getTracks().forEach((track) => {
        track.onended = () => stop();
      });

      streamRef.current = mediaStream;
      setActive(true);
      attach(mediaStream);
      optionsRef.current.onStart?.(mediaStream);

      return mediaStream;
    } catch (requestError) {
      setActive(false);
      optionsRef.current.onError?.(requestError as Error);
      return;
    } finally {
      setLoading(false);
    }
  };

  const apply = async (constraints: MediaStreamConstraints) => {
    if (!streamRef.current || !elementRef.current) return false;
    const tasks: Promise<void>[] = [];

    if (constraints.video && typeof constraints.video === 'object') {
      streamRef.current
        .getVideoTracks()
        .forEach((track) =>
          tasks.push(track.applyConstraints(constraints.video as MediaTrackConstraints))
        );
    }

    if (constraints.audio && typeof constraints.audio === 'object') {
      streamRef.current
        .getAudioTracks()
        .forEach((track) =>
          tasks.push(track.applyConstraints(constraints.audio as MediaTrackConstraints))
        );
    }

    await Promise.all(tasks);
    constraintsRef.current = {
      ...constraintsRef.current,
      ...constraints,
      audio:
        typeof constraintsRef.current.audio === 'object' && typeof constraints.audio === 'object'
          ? { ...constraintsRef.current.audio, ...constraints.audio }
          : constraints.audio,
      video:
        typeof constraintsRef.current.video === 'object' && typeof constraints.video === 'object'
          ? { ...constraintsRef.current.video, ...constraints.video }
          : constraints.video
    };

    return true;
  };

  const restart = async () => {
    cleanup();
    return start();
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (
      target ? isTarget.getElement(target) : internalRef.current
    ) as HTMLMediaElement;

    if (!element) return;
    elementRef.current = element;

    if (!options.immediately) return;
    start();

    return () => {
      cleanup();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  const value = {
    stream: streamRef.current,
    active,
    supported,
    loading,
    start,
    apply,
    stop,
    restart
  };

  if (target) return value;
  return { ...value, ref: internalRef };
}) as UseMediaStream;
