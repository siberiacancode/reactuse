import { useCallback, useRef } from 'react';

import { throttle } from '@/utils/helpers';

import { useEventListener } from '../useEventListener/useEventListener';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

export interface UseDeviceMotionListenerParams {
  target?: Window;
  options?: boolean | AddEventListenerOptions;
  callback?: (event: DeviceMotionEvent) => void;
}

export interface DeviceMotionData {
  interval: DeviceMotionEvent['interval'];
  rotationRate: Exclude<DeviceMotionEvent['rotationRate'], null>;
  acceleration: Exclude<DeviceMotionEvent['acceleration'], null>;
  accelerationIncludingGravity: Exclude<DeviceMotionEvent['accelerationIncludingGravity'], null>;
}

const DEFAULT_DEVICE_MOTION_DATA: DeviceMotionData = {
  interval: 0,
  rotationRate: { alpha: null, beta: null, gamma: null },
  acceleration: { x: null, y: null, z: null },
  accelerationIncludingGravity: { x: null, y: null, z: null }
};

const DEFAULT_DEVICE_MOTION_EVENT_DATA_UPDATE_DELAY = 500;

/**
 * @name useDeviceMotion
 * @description Hook that provides data of the {@link https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent DeviceMotionEvent (MDN)}
 * @category Utilities
 *
 * @param {Number} delay The data update delay
 * @param {UseDeviceMotionListenerParams} listener The event listener parameters
 * @returns {Function getDeviceMotion(): DeviceMotionData} - The function that returns the DeviceMotionEvent data
 *
 * @example
 * const getDeviceMotion = useDeviceMotion(1000);
 * ...
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = getDeviceMotion();
 */
export const useDeviceMotion = (
  delay = DEFAULT_DEVICE_MOTION_EVENT_DATA_UPDATE_DELAY,
  listener: UseDeviceMotionListenerParams = {}
) => {
  const deviceMotionRef = useRef(DEFAULT_DEVICE_MOTION_DATA);
  const handlerRef = useRef(listener.callback);

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = listener.callback;
  }, [listener.callback]);

  const onDeviceMotion = useCallback(
    throttle<[DeviceMotionEvent]>((event) => {
      handlerRef.current?.(event);
      deviceMotionRef.current = {
        interval: event.interval,
        rotationRate: {
          ...deviceMotionRef.current.rotationRate,
          ...event.rotationRate
        },
        acceleration: {
          ...deviceMotionRef.current.acceleration,
          ...event.acceleration
        },
        accelerationIncludingGravity: {
          ...deviceMotionRef.current.accelerationIncludingGravity,
          ...event.accelerationIncludingGravity
        }
      };
    }, delay),
    [delay]
  );

  useEventListener(listener.target ?? window, 'devicemotion', onDeviceMotion, listener.options);

  return useCallback(() => deviceMotionRef.current, []);
};
