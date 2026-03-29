import { useEffect, useState } from 'react';
import { getDate } from '@/utils/helpers';
/**
 * @name useTime
 * @description - Hook that gives you current time in different values
 * @category Time
 * @usage medium
 *
 * @returns {UseTimeReturn} An object containing the current time
 *
 * @example
 * const { seconds, minutes, hours, meridiemHours, day, month, year, timestamp } = useTime();
 */
export const useTime = () => {
  const [time, setTime] = useState(getDate());
  useEffect(() => {
    const timerId = setInterval(() => setTime(getDate()), 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  return time;
};
