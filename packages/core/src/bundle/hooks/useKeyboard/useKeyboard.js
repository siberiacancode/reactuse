import { useEffect } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useKeyboard
 * @description - Hook that helps to listen for keyboard events
 * @category Sensors
 *
 * @overload
 * @param {HookTarget | Window} target The target to attach the event listeners to
 * @param {UseKeyboardOptions} [options] The keyboard event options
 * @returns {void}
 *
 * @example
 * useKeyboard(ref, { onKeyDown: (event) => console.log('key down'), onKeyUp: (event) => console.log('key up') });
 *
 * @overload
 * @template Target The target element type
 * @param {UseKeyboardOptions} [options] The keyboard event options
 * @returns {{ ref: StateRef<Target> }} An object containing the ref
 *
 * @example
 * const ref = useKeyboard({ onKeyDown: (event) => console.log('key down'), onKeyUp: (event) => console.log('key up') });
 */
export const useKeyboard = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target ? params[1] : params[0];
  const internalRef = useRefState(window);
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    const onKeyDown = (event) => options?.onKeyDown?.(event);
    const onKeyUp = (event) => options?.onKeyUp?.(event);
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);
    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [target, internalRef.state]);
  if (target) return;
  return internalRef;
};
