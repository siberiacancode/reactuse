import { useEffect, useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useKeyboard
 * @description - Hook that helps to listen for keyboard events
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target to attach the event listeners to
 * @param {KeyboardEventHandler} callback The callback function to be invoked on key down
 * @returns {void}
 *
 * @example
 * useKeyboard(ref, (event) => console.log('key down'));
 *
 * @overload
 * @param {HookTarget} target The target to attach the event listeners to
 * @param {UseKeyboardEventOptions} [options] The keyboard event options
 * @returns {void}
 *
 * @example
 * useKeyboard(ref, { onKeyDown: (event) => console.log('key down'), onKeyUp: (event) => console.log('key up') });
 *
 * @overload
 * @template Target The target element type
 * @param {KeyboardEventHandler} callback The callback function to be invoked on key down
 * @returns {{ ref: StateRef<Target> }} An object containing the ref
 *
 * @example
 * const ref = useKeyboard((event) => console.log('key down'));
 *
 * @overload
 * @template Target The target element type
 * @param {UseKeyboardEventOptions} [options] The keyboard event options
 * @returns {{ ref: StateRef<Target> }} An object containing the ref
 *
 * @example
 * const ref = useKeyboard({ onKeyDown: (event) => console.log('key down'), onKeyUp: (event) => console.log('key up') });
 */
export const useKeyboard = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target
    ? typeof params[1] === 'object'
      ? params[1]
      : { onKeyDown: params[1] }
    : typeof params[0] === 'object'
      ? params[0]
      : { onKeyDown: params[0] };
  const internalRef = useRefState(window);
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const onKeyDown = (event) => internalOptionsRef.current?.onKeyDown?.(event);
    const onKeyUp = (event) => internalOptionsRef.current?.onKeyUp?.(event);
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);
    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);
  if (target) return;
  return internalRef;
};
