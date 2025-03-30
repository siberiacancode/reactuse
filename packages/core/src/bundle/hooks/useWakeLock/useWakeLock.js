import { useCallback, useEffect, useRef, useState } from 'react';
/**
 * @name useWakeLock
 * @description - Hook that provides an interface to the Screen Wake Lock API, allowing prevention of device screen dimming or locking
 * @category Browser
 *
 * @browserapi navigator.wakeLock https://developer.mozilla.org/en-US/docs/Web/API/WakeLock
 *
 * @param {UseWakeLockOptions} [options] Configuration options for the hook.
 * @returns {UseWakeLockReturn} An object containing the wake lock state and control methods.
 *
 * @example
 * const { supported, active, request, release } = useWakeLock();
 */
export const useWakeLock = (options) => {
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  const [active, setActive] = useState(false);
  const wakeLockSentinel = useRef(null);
  const { type, autoReacquire = false, onError, onRelease, onRequest } = options ?? {};
  const handleRelease = useCallback(() => {
    setActive(false);
    wakeLockSentinel.current = null;
    onRelease?.();
  }, []);
  const request = useCallback(async () => {
    if (!supported) {
      onError?.(new Error('Wake Lock API is not supported in this browser.'));
      return;
    }
    try {
      wakeLockSentinel.current = await navigator.wakeLock.request(type);
      wakeLockSentinel.current.addEventListener('release', handleRelease);
      setActive(true);
      onRequest?.();
    } catch (error) {
      onError?.(error);
    }
  }, [supported, type, handleRelease]);
  const release = useCallback(async () => {
    if (!wakeLockSentinel.current) return;
    try {
      await wakeLockSentinel.current.release();
    } catch (error) {
      onError?.(error);
    }
  }, [handleRelease]);
  useEffect(() => {
    if (!supported || !autoReacquire) return;
    const listener = () => {
      if (document.visibilityState !== 'visible' || wakeLockSentinel.current) return;
      request();
    };
    document.addEventListener('visibilitychange', listener);
    return () => document.removeEventListener('visibilitychange', listener);
  }, [supported, autoReacquire]);
  useEffect(
    () => () => {
      release();
    },
    []
  );
  return { supported, active, request, release };
};
