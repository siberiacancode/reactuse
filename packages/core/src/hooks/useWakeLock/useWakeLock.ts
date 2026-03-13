import { useEffect, useRef, useState } from 'react';

/** The use wake lock options type */
export interface UseWakeLockOptions {
  /** Determines if the wake lock should be automatically reacquired when the document becomes visible. */
  immediately?: boolean;
  /** A string specifying the screen wake lock type. */
  type?: WakeLockType;
}

/** The use wake lock return type */
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
 * @description - Hook that provides a wake lock functionality
 * @category Browser
 * @usage low
 *
 * @browserapi navigator.wakeLock https://developer.mozilla.org/en-US/docs/Web/API/WakeLock
 *
 * @param {immediately} [options] Configuration options for the hook.
 * @returns {UseWakeLockReturn} An object containing the wake lock state and control methods.
 *
 * @example
 * const { supported, active, request, release } = useWakeLock();
 */
export const useWakeLock = (options?: UseWakeLockOptions): UseWakeLockReturn => {
  const supported =
    typeof navigator !== 'undefined' && 'wakeLock' in navigator && !!navigator.wakeLock;

  const [active, setActive] = useState(false);
  const sentinel = useRef<WakeLockSentinel>(undefined);

  const immediately = options?.immediately ?? false;
  const type = options?.type ?? 'screen';

  const request = async (type?: WakeLockType) => {
    if (!supported) return;

    sentinel.current = await navigator.wakeLock.request(type ?? options?.type);
    sentinel.current.addEventListener('release', () => {
      setActive(false);
      sentinel.current = undefined;
    });

    setActive(true);
  };

  const release = async () => {
    if (!supported || !sentinel.current) return;

    await sentinel.current.release();
    sentinel.current = undefined;
    setActive(false);
  };

  useEffect(() => {
    if (!supported || !immediately || document.visibilityState !== 'visible' || type !== 'screen')
      return;

    const onVisibilityChange = async () => {
      await release();
      await request(type);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [type]);

  return { supported, active, request, release };
};
