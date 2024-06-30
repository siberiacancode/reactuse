import { useEffect, useState } from 'react';

import { useEvent } from '@/hooks';

export interface InitialTimeParams {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  count: number;
}

export interface UseStopwatchReturn {
  paused: boolean;
  over: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  count: number;
  pause: () => void;
  start: () => void;
  reset: () => void;
  toggle: () => void;
}

/**
 * @name useStopwatch
 * @description - Hook that creates a stopwatch functionality
 *
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch();
 */

export const useStopwatch = (
  enabled?: boolean,
  initialTime?: InitialTimeParams
): UseStopwatchReturn => {
  const [time, setTime] = useState(
    initialTime ?? {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      count: 0
    }
  );
  const [paused, setPaused] = useState(!enabled);
  const [over, setOver] = useState(false);

  const onInterval = useEvent(() => {
    const updatedCount = time.count + 1;

    if (updatedCount % 60 === 0) {
      return setTime(() => ({
        ...time,
        minutes: time.minutes + 1,
        seconds: 0,
        count: updatedCount
      }));
    }

    if (updatedCount % (60 * 60) === 0) {
      return setTime(() => ({
        ...time,
        hours: time.hours + 1,
        minutes: 0,
        seconds: 0,
        count: updatedCount
      }));
    }

    if (updatedCount % (60 * 60 * 24) === 0) {
      return setTime(() => ({
        ...time,
        days: time.days + 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
        count: updatedCount
      }));
    }

    setTime(() => ({
      ...time,
      seconds: time.seconds + 1,
      count: updatedCount
    }));
  });

  useEffect(() => {
    if (paused) {
      return;
    }
    const interval = setInterval(() => {
      onInterval();
    }, 1000);

    return () => clearInterval(interval);
  }, [time, paused]);

  return {
    paused,
    over,
    ...time,
    pause: () => setPaused(true),
    start: () => setPaused(false),
    reset: () => {
      setOver(false);
      setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, count: 0 });
    },
    toggle: () => setPaused((prevPause) => !prevPause)
  };
};
