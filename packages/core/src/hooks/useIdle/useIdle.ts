import { useEffect, useState } from 'react';

import { throttle } from '@/utils/helpers';

/** The use idle options type */
export interface UseIdleOptions {
  /** The idle events */
  events?: Array<keyof DocumentEventMap>;
  /** The idle state */
  initialValue?: boolean;
}

const IDLE_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'wheel',
  'resize'
] satisfies Array<keyof DocumentEventMap>;
const ONE_MINUTE = 60e3;

/** The use idle return type */
export interface UseIdleReturn {
  /** The idle state */
  idle: boolean;
  /** The last active time */
  lastActive: number;
}

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
  { initialValue = false, events = IDLE_EVENTS }: UseIdleOptions = {}
): UseIdleReturn => {
  const [idle, setIdle] = useState(initialValue);
  const [lastActive, setLastActive] = useState(Date.now());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
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
