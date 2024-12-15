import { useState } from 'react';

import { getDate } from '@/utils/helpers';

import { useInterval } from '../useInterval/useInterval';

export interface UseTimeReturn {
  seconds: number;
  minutes: number;
  hours: number;
  meridiemHours: { value: number; type: string };
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

/**
 * @name useTime
 * @description - Hook that gives you current time in different values
 * @category Time
 *
 * @returns {UseTimeReturn} An object containing the current time
 *
 * @example
 * const { seconds, minutes, hours, meridiemHours, day, month, year, timestamp } = useTime();
 */
export const useTime = (): UseTimeReturn => {
  const [time, setTime] = useState(getDate());
  useInterval(() => setTime(getDate()), 1000);
  return time;
};
