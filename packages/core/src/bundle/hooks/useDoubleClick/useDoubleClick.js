import { useEffect, useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
export const DEFAULT_THRESHOLD_TIME = 300;
/**
 * @name useDoubleClick
 * @description - Hook that defines the logic when double clicking an element
 * @category Elements
 * @usage medium

 * @overload
 * @param {HookTarget} target The target element to be double clicked
 * @param {(event: DoubleClickEvents) => void} callback The callback function to be invoked on double click
 * @param {UseDoubleClickOptions} [options] The options for the double click
 * @returns {boolean} The double clicking state
 *
 * @example
 * useDoubleClick(ref, () => console.log('double clicked'));
 *
 * @overload
 * @template Target The target element
 * @param {(event: DoubleClickEvents) => void} callback The callback function to be invoked on double click
 * @param {UseDoubleClickOptions} [options] The options for the double click
 * @returns {boolean} The double clicking state
 *
 * @example
 * const ref = useDoubleClick(() => console.log('double clicked'));
 *
 * @see {@link https://siberiacancode.github.io/reactuse/functions/hooks/useDoubleClick.html}
 */
export const useDoubleClick = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const callback = target ? params[1] : params[0];
  const options = target ? params[2] : params[1];
  const timeoutIdRef = useRef(undefined);
  const clickCountRef = useRef(0);
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const onClick = (event) => {
      clickCountRef.current += 1;
      if (clickCountRef.current === 1) {
        timeoutIdRef.current = setTimeout(() => {
          if (internalOptionsRef.current?.onSingleClick)
            internalOptionsRef.current.onSingleClick(event);
          clickCountRef.current = 0;
        }, internalOptionsRef.current?.threshold ?? DEFAULT_THRESHOLD_TIME);
      }
      if (clickCountRef.current === 2) {
        clearTimeout(timeoutIdRef.current);
        internalCallbackRef.current(event);
        clickCountRef.current = 0;
      }
    };
    element.addEventListener('mousedown', onClick);
    element.addEventListener('touchstart', onClick);
    return () => {
      element.removeEventListener('mousedown', onClick);
      element.removeEventListener('touchstart', onClick);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [target, internalRef.state, isTarget.getRefState(target)]);
  if (target) return;
  return internalRef;
};
