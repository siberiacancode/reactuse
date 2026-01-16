import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
const DEFAULT_THRESHOLD_TIME = 400;
/**
 * @name useLongPress
 * @description - Hook that defines the logic when long pressing an element
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target element to be long pressed
 * @param {(event: LongPressEvents) => void} callback The callback function to be invoked on long press
 * @param {UseLongPressOptions} [options] The options for the long press
 * @returns {boolean} The long pressing state
 *
 * @example
 * const pressed = useLongPress(ref, () => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {(event: LongPressEvents) => void} callback The callback function to be invoked on long press
 * @param {UseLongPressOptions} [options] The options for the long press
 * @returns {boolean} The long pressing state
 *
 * @example
 * const { ref, pressed } = useLongPress(() => console.log('callback'));
 */
export const useLongPress = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const callback = target ? params[1] : params[0];
  const options = target ? params[2] : params[1];
  const [pressed, setPressed] = useState(false);
  const timeoutIdRef = useRef(undefined);
  const isPressedRef = useRef(false);
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const onStart = (event) => {
      internalOptionsRef.current?.onStart?.(event);
      isPressedRef.current = true;
      timeoutIdRef.current = setTimeout(() => {
        internalCallbackRef.current(event);
        setPressed(true);
      }, internalOptionsRef.current?.threshold ?? DEFAULT_THRESHOLD_TIME);
    };
    const onCancel = (event) => {
      setPressed((prevPressed) => {
        if (prevPressed) {
          internalOptionsRef.current?.onFinish?.(event);
        } else if (isPressedRef.current) {
          internalOptionsRef.current?.onCancel?.(event);
        }
        isPressedRef.current = false;
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        return false;
      });
    };
    element.addEventListener('mousedown', onStart);
    window.addEventListener('mouseup', onCancel);
    element.addEventListener('touchstart', onStart);
    window.addEventListener('touchend', onCancel);
    return () => {
      element.removeEventListener('mousedown', onStart);
      window.removeEventListener('mouseup', onCancel);
      element.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onCancel);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);
  if (target) return pressed;
  return {
    ref: internalRef,
    pressed
  };
};
