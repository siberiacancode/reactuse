import { useEffect, useState } from 'react';

interface UseStopwatchReturn {
  paused: boolean;
  over: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  elapsedSeconds: number;
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

export const useStopwatch = (autoStart: boolean = false): UseStopwatchReturn => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [paused, setIsPaused] = useState(!autoStart);
  const [over, setIsOver] = useState(false);

  useEffect(() => {
    if (paused) {
      return;
    }
    const interval = setInterval(() => {
      setTime((prev) => {
        let d = prev.days;
        let h = prev.hours;
        let m = prev.minutes;
        let s = prev.seconds;

        if (s + 1 >= 60) {
          s = 0;
          if (m + 1 >= 60) {
            m = 0;
            if (h + 1 >= 24) {
              h = 0;
              d += 1;
            } else {
              h += 1;
            }
          } else {
            m += 1;
          }
        } else {
          s += 1;
        }

        return { days: d, hours: h, minutes: m, seconds: s };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, paused]);

  return {
    paused,
    over,
    ...time,
    elapsedSeconds: time.days * 86400 + time.hours * 3600 + time.minutes * 60 + time.seconds,
    pause: () => setIsPaused(true),
    start: () => setIsPaused(false),
    reset: () => {
      setIsOver(false);
      setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    },
    toggle: () => setIsPaused(!paused)
  };
};
