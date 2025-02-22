import { useRef, useState } from 'react';
const DEFAULT_THRESHOLD_TIME = 400;
/**
 * @name useLongPress
 * @description - Hook that defines the logic when long pressing an element
 * @category Sensors
 *
 * @template Target The target element
 * @param {Target} target The target element to be long pressed
 * @param {(event: Event) => void} callback The callback function to be invoked on long press
 * @param {number} [options.threshold] The threshold time in milliseconds
 * @param {(event: Event) => void} [options.onStart] The callback function to be invoked on long press start
 * @param {(event: Event) => void} [options.onFinish] The callback function to be invoked on long press finish
 * @param {(event: Event) => void} [options.onCancel] The callback function to be invoked on long press cancel
 * @returns {UseLongPressReturn<Target>} The ref of the target element
 *
 * @example
 * const [bind, longPressing] = useLongPress(() => console.log('callback'));
 */
export const useLongPress = (callback, options) => {
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const timeoutIdRef = useRef();
  const isPressed = useRef(false);
  const start = (event) => {
    options?.onStart?.(event);
    isPressed.current = true;
    timeoutIdRef.current = setTimeout(() => {
      callback(event);
      setIsLongPressActive(true);
    }, options?.threshold ?? DEFAULT_THRESHOLD_TIME);
  };
  const cancel = (event) => {
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
  };
  return [bind, isLongPressActive];
};
