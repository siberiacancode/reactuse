import React from 'react';

interface UseStopwatchReturn {
  current: string;
  isPaused: boolean;
  isOver: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  elapsedSeconds: number;
  pause: () => void;
  start: () => void;
  reset: () => void;
  togglePause: () => void;
}

/**
 * @name useStopwatch
 * @description - Hook that creates a stopwatch functionality
 *
 * @overload
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch();
 */

const addLeadingZero = (digit: number): string => {
  let timeStr = '';

  if (digit % 10 === digit) {
    timeStr += `0${digit}`;
  }

  timeStr += `${digit}`;

  return timeStr;
};

export const useStopwatch = (autoStart: boolean = false): UseStopwatchReturn => {
  const [time, setTime] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isPaused, setIsPaused] = React.useState(!autoStart);
  const [isOver, setIsOver] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) {
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
  }, [time, isPaused]);

  return {
    current: `${addLeadingZero(time.days)}:${addLeadingZero(
      time.hours
    )}:${addLeadingZero(time.minutes)}:${addLeadingZero(time.seconds)}`,
    isPaused,
    isOver,
    days: time.days,
    hours: time.hours,
    minutes: time.minutes,
    seconds: time.seconds,
    elapsedSeconds: time.days * 86400 + time.hours * 3600 + time.minutes * 60 + time.seconds,
    pause: () => setIsPaused(true),
    start: () => setIsPaused(false),
    reset: () => {
      setIsOver(false);
      setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    },
    togglePause: () => {
      setIsPaused(!isPaused);
    }
  };
};
