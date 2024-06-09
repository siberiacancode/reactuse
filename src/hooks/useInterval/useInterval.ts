import { useEffect, useRef, useState } from 'react';

import { isClient } from '@/utils/helpers';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

/** The useInterval options */
export interface UseIntervalOptions {
  immediate?: boolean;
  immediateCallback?: boolean;
}

/** The useInterval return type */
export interface UseIntervalReturn {
  isActive: Readonly<boolean>;
  pause: () => void;
  resume: () => void;
}

/**
 * @name useInterval
 * @description - Hook that makes and interval and returns controlling functions
 *
 * @param {() => void} intervalFn Any callback function
 * @param {number} [intervalTime=1000] Time in milliseconds
 * @param {boolean} [options.immediate=true] Start the interval immediately
 * @param {boolean} [options.immediateCallback=false] Execute the callback immediately after calling `resume`
 * @returns {UseIntervalReturn}
 *
 * @example
 * const { isActive, pause, resume } = useInterval(() => console.log('inside interval'), 2500);
 */
export const useInterval = (
  intervalFn: () => void,
  intervalTime: number = 1000,
  options: UseIntervalOptions = {}
): UseIntervalReturn => {
  const { immediate = true, immediateCallback = false } = options;
  const [isActive, setIsActive] = useState<boolean>(immediate);
  const savedIntervalFn = useRef(intervalFn);
  const intervalTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const cleanInterval = () => {
    if (intervalTimer.current) {
      clearInterval(intervalTimer.current);
      intervalTimer.current = undefined;
    }
  };

  const createOrRecreateInterval = () => {
    cleanInterval();
    intervalTimer.current = setInterval(savedIntervalFn.current, intervalTime);
  };

  const pause = () => {
    setIsActive(false);
    cleanInterval();
  };

  const resume = () => {
    if (intervalTime <= 0) return;
    setIsActive(true);
    if (immediateCallback) savedIntervalFn.current();
    createOrRecreateInterval();
  };

  useIsomorphicLayoutEffect(() => {
    savedIntervalFn.current = intervalFn;
  }, [intervalFn]);

  useEffect(() => {
    if (immediate && isClient) resume();
    return pause;
  }, [immediate]);

  useEffect(() => {
    if (isActive) createOrRecreateInterval();
  }, [intervalTime]);

  return {
    isActive,
    pause,
    resume
  };
};
