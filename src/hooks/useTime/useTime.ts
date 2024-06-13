import React from 'react';

import { useInterval } from '@/hooks';
import { getDate } from '@/utils/helpers';

interface UseTimeReturn {
  seconds: number;
  minutes: number;
  hours: number;
  meridiemHours: { ampmHours: number; ampm: string };
  day: number;
  month: number;
  year: number;
}

/**
 * @name useTime
 * @description - Hook that gives you current time in different values
 *
 * @returns {UseTimeReturn} An object containing the current time
 *
 * @example
 * const {
 *     seconds,
 *     minutes,
 *     hours,
 *     meridiemHours: { ampmHours, ampm },
 *     day,
 *     month,
 *     year
 *   } = useTime();
 */

export const useTime = (): UseTimeReturn => {
  const [date, setDate] = React.useState(getDate());

  useInterval(() => {
    setDate(getDate());
  }, 1000);

  return date;
};
