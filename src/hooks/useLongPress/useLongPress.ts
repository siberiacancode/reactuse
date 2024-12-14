import type { MouseEventHandler, RefObject, TouchEventHandler } from 'react';
import { useRef, useState } from 'react';

// * The use long press target type */
export type UseLongPressTarget = (() => Element) | Element | RefObject<Element | null | undefined>;

export type LongPressReactEvents<Target extends Element = Element> =
  | MouseEventHandler<Target>
  | TouchEventHandler<Target>;

// * The use long press options type */
export interface UseLongPressOptions {
  // * The threshold time in milliseconds
  threshold?: number;
  // * The callback function to be invoked on long press cancel
  onCancel?: (event: LongPressReactEvents) => void;
  // * The callback function to be invoked on long press end
  onFinish?: (event: LongPressReactEvents) => void;
  // * The callback function to be invoked on long press start
  onStart?: (event: LongPressReactEvents) => void;
}

// * The use long press bind type */
export interface UseLongPressBind {
  /** The callback function to be invoked on mouse down */
  onMouseDown: MouseEventHandler<Element>;
  /** The callback function to be invoked on mouse up */
  onMouseUp: MouseEventHandler<Element>;
  /** The callback function to be invoked on touch end */
  onTouchEnd: TouchEventHandler<Element>;
  /** The callback function to be invoked on touch start */
  onTouchStart: TouchEventHandler<Element>;
}

// * The use long press return type */
export type UseLongPressReturn = [UseLongPressBind, boolean];

const DEFAULT_THRESHOLD_TIME = 400;

/**
 * @name useLongPress
 * @description - Hook that defines the logic when long pressing an element
 * @category Sensors
 *
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
 * const [bind, longPressing] = useLongPress(() => console.log('callback'));
 */
export const useLongPress = (
  callback: (event: LongPressReactEvents) => void,
  options?: UseLongPressOptions
): UseLongPressReturn => {
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>();
  const isPressed = useRef(false);

  const start = (event: LongPressReactEvents) => {
    options?.onStart?.(event);

    isPressed.current = true;
    timeoutIdRef.current = setTimeout(() => {
      callback(event);
      setIsLongPressActive(true);
    }, options?.threshold ?? DEFAULT_THRESHOLD_TIME);
  };

  const cancel = (event: LongPressReactEvents) => {
    if (isLongPressActive) {
      options?.onFinish?.(event);
    } else if (isPressed.current) {
      options?.onCancel?.(event);
    }

    setIsLongPressActive(false);
    isPressed.current = false;

    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
  };

  const bind = {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: cancel,
    onTouchEnd: cancel
  } as unknown as UseLongPressBind;

  return [bind, isLongPressActive];
};
