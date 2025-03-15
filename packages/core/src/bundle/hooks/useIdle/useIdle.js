import { useEffect, useState } from 'react';
import { throttle } from '@/utils/helpers';
const IDLE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel', 'resize'];
const ONE_MINUTE = 60e3;
/**
 * @name useIdle
 * @description - Hook that defines the logic when the user is idle
 * @category Sensors
 *
 * @param {number} [milliseconds=ONE_MINUTE] The idle time in milliseconds
 * @param {boolean} [options.initialState=false] The options for the hook
 * @param {Array<keyof WindowEventMap>} [options.events=IDLE_EVENTS]
 * @returns {UseIdleReturn} An object containing the idle state and the last active time
 *
 * @example
 * const { idle, lastActive } = useIdle();
 */
export const useIdle = (
  milliseconds = ONE_MINUTE,
  { initialValue = false, events = IDLE_EVENTS } = {}
) => {
  const [idle, setIdle] = useState(initialValue);
  const [lastActive, setLastActive] = useState(Date.now());
  useEffect(() => {
    let timeoutId;
    const onTimeout = () => setIdle(true);
    const onEvent = throttle(() => {
      setIdle(false);
      setLastActive(Date.now());
      clearTimeout(timeoutId);
      timeoutId = setTimeout(onTimeout, milliseconds);
    }, 500);
    const onVisibilitychange = () => {
      if (!document.hidden) onEvent();
    };
    timeoutId = setTimeout(onTimeout, milliseconds);
    events.forEach((event) => window.addEventListener(event, onEvent));
    document.addEventListener('visibilitychange', onVisibilitychange);
    return () => {
      events.forEach((event) => window.addEventListener(event, onEvent));
      document.removeEventListener('visibilitychange', onVisibilitychange);
      clearTimeout(timeoutId);
    };
  }, [milliseconds, events]);
  return { idle, lastActive };
};
