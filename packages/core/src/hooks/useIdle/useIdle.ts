import { useEffect, useRef, useState } from 'react';

import { throttle } from '@/utils/helpers';

/** The use idle callback type */
export type UseIdleCallback = (idle: boolean) => void;

/** The use idle options type */
export interface UseIdleOptions {
  /** The idle events */
  events?: Array<keyof DocumentEventMap>;
  /** The idle state */
  initialValue?: boolean;
  /** The callback to execute when idle state changes */
  onChange?: UseIdleCallback;
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

export interface UseIdle {
  (): UseIdleReturn;

  (milliseconds: number, callback: UseIdleCallback): UseIdleReturn;

  (milliseconds: number, options?: UseIdleOptions): UseIdleReturn;
}

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
export const useIdle = ((...params: any[]) => {
  const milliseconds = (typeof params[0] === 'number' ? params[0] : ONE_MINUTE) as number;
  const options = (typeof params[1] === 'function' ? { onChange: params[1] } : params[1]) as
    | UseIdleOptions
    | undefined;

  const initialValue = options?.initialValue ?? false;
  const events = options?.events ?? IDLE_EVENTS;

  const [idle, setIdle] = useState(initialValue);
  const [lastActive, setLastActive] = useState(Date.now());

  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

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
}) as UseIdle;
