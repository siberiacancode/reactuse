import { useEffect, useRef, useState } from 'react';
import { throttle } from '@/utils/helpers';
const IDLE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel', 'resize'];
const ONE_MINUTE = 60e3;
/**
 * @name useIdle
 * @description - Hook that defines the logic when the user is idle
 * @category Sensors
 * @usage low
 *
 * @overload
 * @returns {UseIdleReturn} An object containing the idle state and the last active time
 *
 * @example
 * const { idle, lastActive } = useIdle();
 *
 * @overload
 * @param {number} [milliseconds=ONE_MINUTE] The idle time in milliseconds
 * @param {(idle: boolean) => void} callback The callback to execute when idle state changes
 * @returns {UseIdleReturn} An object containing the idle state and the last active time
 *
 * @example
 * const { idle, lastActive } = useIdle(1000, (idle) => console.log(idle));
 *
 * @overload
 * @param {number} [milliseconds=ONE_MINUTE] The idle time in milliseconds
 * @param {(idle: boolean) => void} [options.onChange] The callback to execute when idle state changes
 * @param {boolean} [options.initialValue=false] The options for the hook
 * @param {Array<keyof WindowEventMap>} [options.events=IDLE_EVENTS]
 * @returns {UseIdleReturn} An object containing the idle state and the last active time
 *
 * @example
 * const { idle, lastActive } = useIdle(1000, { onChange: (idle) => console.log(idle) });
 */
export const useIdle = (...params) => {
  const milliseconds = typeof params[0] === 'number' ? params[0] : ONE_MINUTE;
  const options = typeof params[1] === 'function' ? { onChange: params[1] } : params[1];
  const initialValue = options?.initialValue ?? false;
  const events = options?.events ?? IDLE_EVENTS;
  const [idle, setIdle] = useState(initialValue);
  const [lastActive, setLastActive] = useState(Date.now());
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  useEffect(() => {
    let timeoutId;
    const onTimeout = () => {
      internalOptionsRef.current?.onChange?.(true);
      setIdle(true);
    };
    const onEvent = throttle(() => {
      internalOptionsRef.current?.onChange?.(false);
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
      events.forEach((event) => window.removeEventListener(event, onEvent));
      document.removeEventListener('visibilitychange', onVisibilitychange);
      clearTimeout(timeoutId);
    };
  }, [milliseconds, events]);
  return { idle, lastActive };
};
