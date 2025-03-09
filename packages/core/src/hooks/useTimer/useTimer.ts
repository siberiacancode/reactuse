import { useEffect, useRef, useState } from 'react';

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
  /** The function to update the timer */
  update: (seconds: number) => void;
}

export interface UseTimer {
  (timestamp: number, callback: () => void): UseTimerReturn;

  (timestamp: number, options?: UseTimerOptions): UseTimerReturn;
}

/**
 * @name useTimer
 * @description - Hook that creates a timer functionality
 * @category Time
 *
 * @overload
 * @param {number} timestamp The timestamp value that define for how long the timer will be running
 * @param {() => void} callback The function to be executed once countdown timer is expired
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active } = useTimer(1000, () => console.log('ready'));
 *
 * @overload
 * @param {number} timestamp The timestamp value that define for how long the timer will be running
 * @param {boolean} [options.immediately=true] The flag to decide if timer should start automatically
 * @param {() => void} [options.onExpire] The function to be executed when the timer is expired
 * @param {(timestamp: number) => void} [options.onTick] The function to be executed on each tick of the timer
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active } = useTimer(1000);
 */
export const useTimer = ((...params: any[]) => {
  const timestamp = params[0];
  const options = (typeof params[1] === 'object' ? params[1] : { onExpire: params[1] }) as
    | UseTimerOptions
    | undefined;

  const immediately = options?.immediately ?? true;
  const [active, setActive] = useState<boolean>(immediately ?? true);
  const [seconds, setSeconds] = useState(Math.ceil(timestamp / 1000));

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>();
  const optionsRef = useRef<UseTimerOptions>();
  optionsRef.current = options ?? {};

  useEffect(() => {
    if (!active) return;

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

  const restart = (timestamp: number, immediately = true) => {
    setSeconds(Math.ceil(timestamp / 1000));
    if (immediately) setActive(true);
  };

  const start = () => {
    setActive(true);
    setSeconds(Math.ceil(timestamp / 1000));
  };

  const clear = () => {
    setActive(false);
    setSeconds(0);
  };

  const update = (timestamp: number) => setSeconds(Math.ceil(timestamp / 1000));

  return {
    ...getTimeFromSeconds(seconds),
    pause,
    active,
    resume,
    toggle,
    start,
    restart,
    clear,
    update
  };
}) as UseTimer;
