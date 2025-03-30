import { useCallback, useEffect, useRef, useState } from 'react';

/** Options for configuring the behavior of the `useWakeLock` hook. */
export interface UseWakeLockOptions {
  /** Determines if the wake lock should be automatically reacquired when the document becomes visible. */
  autoReacquire?: boolean;
  /** A string specifying the screen wake lock type. */
  type?: WakeLockType;
  /** Callback invoked when an error occurs while acquiring the wake lock. */
  onError?: (error: Error) => void;
  /** Callback invoked when the wake lock is released. */
  onRelease?: () => void;
  /** Callback invoked when the wake lock is successfully acquired. */
  onRequest?: () => void;
}

/** The return type of the `useWakeLock` hook, providing state and control methods. */
export interface UseWakeLockReturn {
  /** Indicates if the wake lock is currently active. */
  active: boolean;
  /** Indicates if the Wake Lock API is supported in the current environment. */
  supported: boolean;
  /** Function to release the wake lock. */
  release: () => Promise<void>;
  /** Function to request the wake lock. */
  request: () => Promise<void>;
}

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
export const useWakeLock = (options?: UseWakeLockOptions): UseWakeLockReturn => {
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

  const [active, setActive] = useState<boolean>(false);
  const wakeLockSentinel = useRef<WakeLockSentinel | null>(null);

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
      onError?.(error as Error);
    }
  }, [supported, type, handleRelease]);

  const release = useCallback(async () => {
    if (!wakeLockSentinel.current) return;

    try {
      await wakeLockSentinel.current.release();
    } catch (error) {
      onError?.(error as Error);
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
