import { useCallback, useState } from 'react';

import {
  getDelayFromExpiryTimestamp,
  getSecondsFromExpiry,
  getTimeFromSeconds
} from '@/utils/helpers';

import { useInterval } from '../useInterval/useInterval';

interface UseTimerParams {
  expiryTimestamp: Date;
  autoStart?: boolean;
  onExpire?: () => void;
}

interface UseTimerReturn {
  /** flag to indicate if timer is running or not */
  isRunning: boolean;
  /** The day count of the timer */
  days: number;
  /** The hour count of the timer */
  hours: number;
  /** The minute count of the timer */
  minutes: number;
  /** The second count of the timer */
  seconds: number;
  /** The total count of the timer */
  totalSeconds: number;
  /** The function to pause the timer */
  pause: () => void;
  /** The function to start the timer */
  start: () => void;
  /** The function to restart the timer */
  restart: (newExpiryTimestamp: Date, newAutoStart?: boolean) => void;
  /** The function to resume the timer */
  resume: () => void;
}

/**
 * @name useTimer
 * @description - Hook that creates a timer functionality
 * @category Time
 *
 * @param {Date} expiryTimestamp Value that define for how long the timer will be running
 * @param {boolean} autoStart flag to decide if timer should start automatically
 * @param {() => void} onExpire The function to be executed once countdown timer is expired
 * @returns {UseTimerReturn} An object with a time values and function to interact with timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useTimer(1000, () => console.warn('Timer is over'));
 */
export const useTimer = ({
  expiryTimestamp: expiry,
  onExpire,
  autoStart = true
}: UseTimerParams): UseTimerReturn => {
  const [expiryTimestamp, setExpiryTimestamp] = useState(expiry);
  const [seconds, setSeconds] = useState(getSecondsFromExpiry(expiryTimestamp));
  const [isRunning, setIsRunning] = useState(autoStart);
  const [didStart, setDidStart] = useState(autoStart);
  const [delay, setDelay] = useState(getDelayFromExpiryTimestamp(expiryTimestamp));

  const handleExpire = useCallback(() => {
    if (onExpire) {
      onExpire();
    }
    setIsRunning(false);
    setDelay(0);
  }, [onExpire]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const restart = useCallback((newExpiryTimestamp: Date, newAutoStart = true) => {
    setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp));
    setDidStart(newAutoStart);
    setIsRunning(newAutoStart);
    setExpiryTimestamp(newExpiryTimestamp);
    setSeconds(getSecondsFromExpiry(newExpiryTimestamp));
  }, []);

  const resume = useCallback(() => {
    const time = new Date();
    time.setMilliseconds(time.getMilliseconds() + seconds * 1000);
    restart(time);
  }, [seconds, restart]);

  const start = useCallback(() => {
    if (didStart) {
      setSeconds(getSecondsFromExpiry(expiryTimestamp));
      setIsRunning(true);
    } else {
      resume();
    }
  }, [expiryTimestamp, didStart, resume]);

  useInterval(
    () => {
      const secondsValue = getSecondsFromExpiry(expiryTimestamp);
      setSeconds(secondsValue);

      if (secondsValue <= 0) {
        handleExpire();
      }
    },
    isRunning ? delay : 0
  );

  return {
    ...getTimeFromSeconds(seconds),
    start,
    pause,
    resume,
    restart,
    isRunning
  };
};
