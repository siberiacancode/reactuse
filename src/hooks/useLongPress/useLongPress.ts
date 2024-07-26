import type { RefObject } from 'react';
import { useRef, useState } from 'react';

import { useEventListener } from '../useEventListener/useEventListener';

// * The use long press target type */
export type UseLongPressTarget = RefObject<Element | null | undefined> | (() => Element) | Element;

// * The use long press options type */
export interface UseLongPressOptions {
  // * The threshold time in milliseconds
  threshold?: number;
  // * The callback function to be invoked on long press start
  onStart?: (event: Event) => void;
  // * The callback function to be invoked on long press end
  onFinish?: (event: Event) => void;
  // * The callback function to be invoked on long press cancel
  onCancel?: (event: Event) => void;
}

// * The use long press return type */
export type UseLongPressReturn<Target extends UseLongPressTarget> = [RefObject<Target>, boolean];

export type UseLongPress = {
  <Target extends UseLongPressTarget>(
    target: Target,
    callback: (event: Event) => void,
    options?: UseLongPressOptions
  ): boolean;

  <Target extends UseLongPressTarget>(
    callback: (event: Event) => void,
    options?: UseLongPressOptions,
    target?: never
  ): UseLongPressReturn<Target>;
};

const DEFAULT_THRESHOLD_TIME = 400;

/**
 * @name useLongPress
 * @description - Hook that defines the logic when long pressing an element
 * @category Sensors
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to be long pressed
 * @param {(event: Event) => void} callback The callback function to be invoked on long press
 * @param {number} [options.threshold=400] The threshold time in milliseconds
 * @param {(event: Event) => void} [options.onStart] The callback function to be invoked on long press start
 * @param {(event: Event) => void} [options.onFinish] The callback function to be invoked on long press finish
 * @param {(event: Event) => void} [options.onCancel] The callback function to be invoked on long press cancel
 * @returns {void}
 *
 * @example
 * const longPressing = useLongPress(ref, () => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to be long pressed
 * @param {(event: Event) => void} callback The callback function to be invoked on long press
 * @param {number} [options.threshold=400] The threshold time in milliseconds
 * @param {(event: Event) => void} [options.onStart] The callback function to be invoked on long press start
 * @param {(event: Event) => void} [options.onFinish] The callback function to be invoked on long press finish
 * @param {(event: Event) => void} [options.onCancel] The callback function to be invoked on long press cancel
 * @returns {UseLongPressReturn<Target>} The ref of the target element
 *
 * @example
 * const [ref, longPressing] = useLongPress(() => console.log('callback'));
 */
export const useLongPress = ((...params: any[]) => {
  const target = (
    params[0] instanceof Function || !('current' in params[0]) ? undefined : params[0]
  ) as UseLongPressTarget | undefined;
  const callback = (target ? params[1] : params[0]) as (event: Event) => void;
  const options = (target ? params[2] : params[1]) as UseLongPressOptions | undefined;

  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const internalRef = useRef<Element>();
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>();
  const isPressed = useRef(false);

  const start = (event: Event) => {
    options?.onStart?.(event);

    isPressed.current = true;
    timeoutIdRef.current = setTimeout(() => {
      callback(event);
      setIsLongPressActive(true);
    }, options?.threshold ?? DEFAULT_THRESHOLD_TIME);
  };

  const cancel = (event: Event) => {
    if (isLongPressActive) {
      options?.onFinish?.(event);
    } else if (isPressed.current) {
      options?.onCancel?.(event);
    }

    setIsLongPressActive(false);
    isPressed.current = false;

    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
  };

  useEventListener(target ?? internalRef, 'mousedown', start);
  useEventListener(target ?? internalRef, 'touchstart', start);
  useEventListener(target ?? internalRef, 'mouseup', cancel);
  useEventListener(target ?? internalRef, 'touchend', cancel);

  if (target) return isLongPressActive;
  return [internalRef, isLongPressActive];
}) as UseLongPress;
