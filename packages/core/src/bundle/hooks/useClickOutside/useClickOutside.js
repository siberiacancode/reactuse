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
 * @param {boolean} [options.enabled=true] Whether outside click handling is enabled
 * @returns {void}
 *
 * @example
 * useClickOutside(ref, () => console.log('click outside'), { enabled: opened });
 *
 * @overload
 * @template Target The target element(s)
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @param {boolean} [options.enabled=true] Whether outside click handling is enabled
 * @returns {StateRef<Target>} A ref to attach to the target element
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => console.log('click outside'), {
 *   enabled: opened
 * });
 *
 * @see {@link https://reactuse.org/functions/hooks/useClickOutside}
 */
export const useClickOutside = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const callback = target ? params[1] : params[0];
  const options = target ? params[2] : params[1];
  const enabled = options?.enabled ?? true;
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;
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
  }, [enabled, target && isTarget.getRawElement(target), internalRef.state]);
  if (target) return;
  return internalRef;
};
