import { useEffect, useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useClickOutside
 * @description - Hook to handle click events outside the specified target element(s)
 * @category Elements
 * @usage necessary

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
 * @returns {{ ref: StateRef<Target> }} A ref to attach to the target element
 *
 * @example
 * const { ref } = useClickOutside<HTMLDivElement>(() => console.log('click outside'));
 *
 * @see {@link https://siberiacancode.github.io/reactuse/functions/hooks/useClickOutside.html}
 */
export const useClickOutside = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const callback = params[1] ? params[1] : params[0];
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const onClick = (event) => {
      if (!element.contains(event.target)) {
        internalCallbackRef.current(event);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);
  if (target) return;
  return { ref: internalRef };
};
