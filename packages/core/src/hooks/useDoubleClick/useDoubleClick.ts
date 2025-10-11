import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

export type DoubleClickEvents = MouseEvent | TouchEvent;

/** The use double click options type */
export interface UseDoubleClickOptions {
  /** The threshold time in milliseconds between clicks */
  threshold?: number;
  /** The callback function to be invoked on single click */
  onSingleClick?: (event: DoubleClickEvents) => void;
}

export interface UseDoubleClick {
  (
    target: HookTarget,
    callback: (event: DoubleClickEvents) => void,
    options?: UseDoubleClickOptions
  ): boolean;

  <Target extends Element>(
    callback: (event: DoubleClickEvents) => void,
    options?: UseDoubleClickOptions,
    target?: never
  ): StateRef<Target>;
}

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
export const useDoubleClick = ((...params: any[]): any => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (target ? params[1] : params[0]) as (event: DoubleClickEvents) => void;
  const options = (target ? params[2] : params[1]) as UseDoubleClickOptions | undefined;

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const clickCountRef = useRef(0);
  const internalRef = useRefState<Element>();

  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    const onClick = (event: DoubleClickEvents) => {
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

    element.addEventListener('mousedown', onClick as EventListener);
    element.addEventListener('touchstart', onClick as EventListener);

    return () => {
      element.removeEventListener('mousedown', onClick as EventListener);
      element.removeEventListener('touchstart', onClick as EventListener);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [target, internalRef.state]);

  if (target) return;
  return internalRef;
}) as UseDoubleClick;
