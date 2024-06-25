import { useEffect, useState } from 'react';

export interface InitialTimeParams {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface UseStopwatchParams {
  enabled?: boolean;
  initialTime?: InitialTimeParams;
}

export interface UseStopwatchReturn {
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

export const useStopwatch = ({ enabled, initialTime }: UseStopwatchParams): UseStopwatchReturn => {
  const [time, setTime] = useState(
    initialTime || {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  );
  const [paused, setPaused] = useState(!enabled);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (paused) {
      return;
    }
    const interval = setInterval(() => {
      setTime((prevTime) => {
        let d = prevTime.days;
        let h = prevTime.hours;
        let m = prevTime.minutes;
        let s = prevTime.seconds;

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
    pause: () => setPaused(true),
    start: () => setPaused(false),
    reset: () => {
      setOver(false);
      setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    },
    toggle: () => setPaused((prevPause) => !prevPause)
  };
};
