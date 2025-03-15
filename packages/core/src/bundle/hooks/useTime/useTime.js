import { useState } from 'react';
import { getDate } from '@/utils/helpers';
import { useInterval } from '../useInterval/useInterval';
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
export const useTime = () => {
  const [time, setTime] = useState(getDate());
  useInterval(() => setTime(getDate()), 1000);
  return time;
};
