import { useEffect, useRef, useState } from 'react';
/**
 * @name useVibrate
 * @description - Hook that provides vibrate api
 * @category Browser
 *
 * @browserapi navigator.vibrate https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
 *
 * @overload
 * @param {UseVibratePattern} options.pattern The pattern for vibration
 * @param {number} [options.interval=0] Time in milliseconds between vibrations
 * @returns {UseVibrateReturn} An object containing support indicator, start vibration and stop vibration functions
 *
 * @example
 * const { supported, active, vibrate, stop, pause, resume } = useVibrate(1000);
 */
export const useVibrate = (pattern, interval = 0) => {
  const supported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  const intervalIdRef = useRef();
  const [active, setActive] = useState(false);
  const trigger = (internalPattern = pattern) => {
    if (!supported) return;
    navigator.vibrate(internalPattern);
  };
  const stop = () => {
    if (!supported) return;
    navigator.vibrate(0);
    setActive(false);
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };
  const pause = () => {
    if (!supported) return;
    setActive(false);
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };
  const resume = (intervalInterval = interval) => {
    if (!supported) return;
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    setActive(true);
    intervalIdRef.current = setInterval(trigger, intervalInterval);
  };
  useEffect(() => {
    if (!supported || interval <= 0) return;
    resume(interval);
    return () => {
      stop();
    };
  }, [interval, pattern]);
  return { supported, trigger, stop, active, pause, resume };
};
