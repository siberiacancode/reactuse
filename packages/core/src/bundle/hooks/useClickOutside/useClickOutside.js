import { useEffect, useRef } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useClickOutside
 * @description - Hook to handle click events outside the specified target element(s)
 * @category Sensors
 *
 * @overload
 * @param {HookTarget} target The target element(s) to detect outside clicks for
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @returns {void}
 *
 * @example
 * useClickOutside(ref, () => console.log('click outside'));
 *
 * @overload
 * @template Target The target element(s)
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @returns {(node: Target) => void} A React ref to attach to the target element
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => console.log('click outside'));
 */
export const useClickOutside = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const callback = params[1] ? params[1] : params[0];
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const onClick = (event) => {
      const element = target ? getElement(target) : internalRef.current;
      if (element && !element.contains(event.target)) {
        internalCallbackRef.current(event);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [target, internalRef.state]);
  if (target) return;
  return internalRef;
};
