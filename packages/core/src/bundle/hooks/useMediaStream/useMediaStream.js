import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
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
export const useMediaStream = (...params) => {
  const supported =
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    !!navigator.mediaDevices &&
    'getUserMedia' in navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia;
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = (target ? params[1] : params[0]) ?? {};
  const [active, setActive] = useState(options.immediately ?? false);
  const [loading, setLoading] = useState(false);
  const internalRef = useRefState();
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const streamRef = useRef(undefined);
  const constraintsRef = useRef(
    options.constraints ?? {
      video: true,
      audio: true
    }
  );
  const elementRef = useRef(null);
  const attach = (mediaStream) => {
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
  const start = async (constraints) => {
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
      optionsRef.current.onError?.(requestError);
      return;
    } finally {
      setLoading(false);
    }
  };
  const apply = async (constraints) => {
    if (!streamRef.current || !elementRef.current) return false;
    const tasks = [];
    if (constraints.video && typeof constraints.video === 'object') {
      streamRef.current
        .getVideoTracks()
        .forEach((track) => tasks.push(track.applyConstraints(constraints.video)));
    }
    if (constraints.audio && typeof constraints.audio === 'object') {
      streamRef.current
        .getAudioTracks()
        .forEach((track) => tasks.push(track.applyConstraints(constraints.audio)));
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
    const element = target ? isTarget.getElement(target) : internalRef.current;
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
};
