import { useState } from 'react';

import { useInterval } from '../useInterval/useInterval';

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
  autostart?: boolean;
  /** The function to be executed when the timer is expired */
  onExpire?: () => void;
  /** Callback function to be executed on each tick of the timer */
  onTick?: (seconds: number) => void;
}

/** The use timer return type */
export interface UseTimerReturn {
  /** The day count of the timer */
  days: number;
  /** The hour count of the timer */
  hours: number;
  /** The minute count of the timer */
  minutes: number;
  /** flag to indicate if timer is running or not */
  running: boolean;
  /** The second count of the timer */
  seconds: number;
  /** The function to pause the timer */
  pause: () => void;
  /** The function to restart the timer */
  restart: (time: number, autostart?: boolean) => void;
  /** The function to start the timer */
  start: () => void;
  /** The function to toggle the timer */
  toggle: () => void;
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
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, running } = useTimer(1000, () => console.log('ready'));
 *
 * @overload
 * @param {number} timestamp The timestamp value that define for how long the timer will be running
 * @param {boolean} options.autostart The flag to decide if timer should start automatically
 * @param {() => void} options.onExpire The function to be executed when the timer is expired
 * @param {(timestamp: number) => void} options.onTick The function to be executed on each tick of the timer
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, running } = useTimer(1000);
 */
export const useTimer = ((...params: any[]) => {
  const timestamp = params[0];
  const options = (typeof params[1] === 'object' ? params[1] : { onExpire: params[1] }) as
    | UseTimerOptions
    | undefined;

  const autostart = options?.autostart ?? true;

  const [seconds, setSeconds] = useState(Math.ceil(timestamp / 1000));
  const [running, setRunning] = useState(autostart);

  const restart = (timestamp: number, autostart = true) => {
    setSeconds(Math.ceil(timestamp / 1000));
    setRunning(autostart);
  };

  const start = () => {
    setRunning(true);
    setSeconds(Math.ceil(timestamp / 1000));
  };

  useInterval(
    () => {
      const updatedSeconds = seconds - 1;
      options?.onTick?.(seconds);
      setSeconds(updatedSeconds);

      if (updatedSeconds === 0) {
        setRunning(false);
        options?.onExpire?.();
      }
    },
    1000,
    { enabled: running }
  );

  return {
    ...getTimeFromSeconds(seconds),
    pause: () => setRunning(false),
    toggle: () => setRunning(!running),
    start,
    restart,
    running
  };
}) as UseTimer;
