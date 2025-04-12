import { useEffect, useRef, useState } from 'react';
/**
 * @name useWakeLock
 * @description - Hook that provides a wake lock functionality
 * @category Browser
 *
 * @browserapi navigator.wakeLock https://developer.mozilla.org/en-US/docs/Web/API/WakeLock
 *
 * @param {immediately} [options] Configuration options for the hook.
 * @returns {UseWakeLockReturn} An object containing the wake lock state and control methods.
 *
 * @example
 * const { supported, active, request, release } = useWakeLock();
 */
export const useWakeLock = (options) => {
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  const [active, setActive] = useState(false);
  const sentinel = useRef();
  const immediately = options?.immediately ?? false;
  const type = options?.type ?? 'screen';
  const request = async (type) => {
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
