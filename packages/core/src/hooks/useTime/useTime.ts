import { useEffect, useState } from 'react';

import { getDate } from '@/utils/helpers';

export interface UseTimeReturn {
  /** The current day of the month (1-31) */
  day: number;
  /** The current hour in 24-hour format (0-23) */
  hours: number;
  /** The current hour in 12-hour format with meridiem type (AM/PM) */
  meridiemHours: { value: number; type: string };
  /** The current minute (0-59) */
  minutes: number;
  /** The current month (1-12) */
  month: number;
  /** The current second (0-59) */
  seconds: number;
  /** The current Unix timestamp in milliseconds */
  timestamp: number;
  /** The current year */
  year: number;
}

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
export const useTime = (): UseTimeReturn => {
  const [time, setTime] = useState(getDate());

  useEffect(() => {
    const timerId = setInterval(() => setTime(getDate()), 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return time;
};
