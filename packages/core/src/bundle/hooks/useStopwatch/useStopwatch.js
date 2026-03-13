import { useEffect, useState } from 'react';
const getStopwatchTime = (time) => {
  if (!time)
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      count: 0
    };
  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return { days, hours, minutes, seconds, count: time };
};
/**
 * @name useStopwatch
 * @description - Hook that creates a stopwatch functionality
 * @category Time
 * @usage high
 *
 * @overload
 * @param {number} [initialTime=0] The initial time of the timer
 * @param {boolean} [options.immediately=false] Start the stopwatch immediately
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch(1000, { immediately: false });
 *
 * @overload
 * @param {number} [options.initialTime=0] The initial time of the timer
 * @param {boolean} [options.immediately=false] Start the stopwatch immediately
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch({ initialTime: 1000, immediately: false });
 */
export const useStopwatch = (...params) => {
  const initialTime = (typeof params[0] === 'number' ? params[0] : params[0]?.initialTime) ?? 0;
  const options = typeof params[0] === 'number' ? params[1] : params[0];
  const immediately = options?.immediately ?? false;
  const [count, setCount] = useState(initialTime);
  const [paused, setPaused] = useState(!immediately);
  useEffect(() => {
    setCount(initialTime);
  }, [initialTime]);
  useEffect(() => {
    if (paused) return;
    const onInterval = () => {
      setCount((prevCount) => prevCount + 1);
    };
    const interval = setInterval(onInterval, 1000);
    return () => clearInterval(interval);
  }, [paused]);
  const time = getStopwatchTime(count);
  return {
    ...time,
    paused,
    pause: () => setPaused(true),
    start: () => setPaused(false),
    reset: () => setCount(initialTime),
    toggle: () => setPaused((prevPause) => !prevPause)
  };
};
