import { useEffect, useRef, useState } from 'react';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';

export const getTimeFromSeconds = (timestamp: number) => {
  const roundedTimestamp = Math.ceil(timestamp);
  const days = Math.floor(roundedTimestamp / (60 * 60 * 24));
  const hours = Math.floor((roundedTimestamp % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((roundedTimestamp % (60 * 60)) / 60);
  const seconds = Math.floor(roundedTimestamp % 60);

  return {
    seconds,
    minutes,
    hours,
    days
  };
};

/** The use timer options type */
export interface UseTimerOptions {
  /** Whether the timer should start automatically */
  immediately?: boolean;
  /** The function to be executed when the timer is expired */
  onExpire?: () => void;
  /** The function to be executed when the timer is started */
  onStart?: () => void;
  /** Callback function to be executed on each tick of the timer */
  onTick?: (seconds: number) => void;
}

/** The use timer return type */
export interface UseTimerReturn {
  /** flag to indicate if timer is active or not */
  active: boolean;
  /** The day count of the timer */
  days: number;
  /** The hour count of the timer */
  hours: number;
  /** The minute count of the timer */
  minutes: number;
  /** The second count of the timer */
  seconds: number;
  /** The function to clear the timer */
  clear: () => void;
  /** The function to decrease the timer */
  decrease: (seconds: number) => void;
  /** The function to increase the timer */
  increase: (seconds: number) => void;
  /** The function to pause the timer */
  pause: () => void;
  /** The function to restart the timer */
  restart: (time: number, immediately?: boolean) => void;
  /** The function to resume the timer */
  resume: () => void;
  /** The function to start the timer */
  start: () => void;
  /** The function to toggle the timer */
  toggle: () => void;
}

export interface UseTimer {
  (): UseTimerReturn;

  (seconds: number, callback: () => void): UseTimerReturn;

  (seconds: number, options?: UseTimerOptions): UseTimerReturn;
}

/**
 * @name useTimer
 * @description - Hook that creates a timer functionality
 * @category Time
 *
 * @overload
 * @returns {UseTimerReturn} An object containing the timer properties and functions
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer();
 *
 * @overload
 * @param {number} seconds The seconds value that define for how long the timer will be running
 * @param {() => void} callback The function to be executed once countdown timer is expired
 * @returns {UseTimerReturn} An object containing the timer properties and functions
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer(1000, () => console.log('ready'));
 *
 * @overload
 * @param {number} seconds The seconds value that define for how long the timer will be running
 * @param {boolean} [options.immediately=true] The flag to decide if timer should start automatically
 * @param {() => void} [options.onExpire] The function to be executed when the timer is expired
 * @param {(timestamp: number) => void} [options.onTick] The function to be executed on each tick of the timer
 * @returns {UseTimerReturn} An object containing the timer properties and functions
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer(1000);
 */
export const useTimer = ((...params: any[]) => {
  const initialSeconds = (params[0] ?? 0) as number;
  const options = (typeof params[1] === 'object' ? params[1] : { onExpire: params[1] }) as
    | UseTimerOptions
    | undefined;

  const immediately = initialSeconds > 0 && (options?.immediately ?? true);
  const [active, setActive] = useState(immediately);
  const [seconds, setSeconds] = useState(initialSeconds);

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>();
  const optionsRef = useRef<UseTimerOptions>();
  optionsRef.current = options ?? {};

  useDidUpdate(() => {
    if (initialSeconds <= 0) {
      setActive(false);
      setSeconds(0);
      return;
    }

    setActive(true);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!active) return;

    optionsRef.current?.onStart?.();
    const onInterval = () => {
      optionsRef.current?.onTick?.(seconds);
      setSeconds((prevSeconds) => {
        const updatedSeconds = prevSeconds - 1;
        if (updatedSeconds === 0) {
          setActive(false);
          optionsRef.current?.onExpire?.();
        }
        return updatedSeconds;
      });
    };

    intervalIdRef.current = setInterval(onInterval, 1000);
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [active]);

  const pause = () => setActive(false);

  const resume = () => {
    if (seconds <= 0) return;
    setActive(true);
  };

  const toggle = () => setActive(!active);

  const restart = (seconds: number, immediately = true) => {
    setSeconds(seconds);
    if (immediately) setActive(true);
  };

  const start = () => {
    if (initialSeconds <= 0) return;

    setActive(true);
    setSeconds(initialSeconds);
  };

  const clear = () => {
    setActive(false);
    setSeconds(0);
  };

  const increase = (seconds: number) => setSeconds((prevSeconds) => prevSeconds + seconds);
  const decrease = (seconds: number) => {
    setSeconds((prevSeconds) => {
      const updatedSeconds = prevSeconds - seconds;
      if (updatedSeconds <= 0) {
        setActive(false);
        return 0;
      } else {
        return updatedSeconds;
      }
    });
  };

  return {
    ...getTimeFromSeconds(seconds),
    count: seconds,
    pause,
    active,
    resume,
    toggle,
    start,
    restart,
    clear,
    increase,
    decrease
  };
}) as UseTimer;
