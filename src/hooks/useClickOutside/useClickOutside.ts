import type { RefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

import { getElement } from '@/utils/helpers';

/** The use click outside target element type */
export type UseClickOutsideTarget =
  | (() => Element)
  | string
  | Element
  | RefObject<Element | null | undefined>;

export interface UseClickOutside {
  <Target extends UseClickOutsideTarget | UseClickOutsideTarget[]>(
    target: Target,
    callback: (event: Event) => void
  ): void;

  <Target extends UseClickOutsideTarget | UseClickOutsideTarget[]>(
    callback: (event: Event) => void,
    target?: never
  ): (node: Target) => void;
}

/**
 * @name useClickOutside
 * @description - Hook to handle click events outside the specified target element(s)
 * @category Sensors
 *
 * @overload
 * @template Target The target element(s)
 * @param {Target} target The target element(s) to detect outside clicks for
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
 * const ref = useClickOutside<HMLDiTvElement>(() => console.log('click outside'));
 */
export const useClickOutside = ((...params: any[]) => {
  const target = (typeof params[1] === 'undefined' ? undefined : params[0]) as
    | UseClickOutsideTarget
    | UseClickOutsideTarget[]
    | undefined;
  const callback = (params[1] ? params[1] : params[0]) as (event: Event) => void;

  const [internalRef, setInternalRef] = useState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!target && !internalRef) return;
    const handler = (event: Event) => {
      if (Array.isArray(target)) {
        if (!target.length) return;

        const isClickedOutsideElements = target.every((target) => {
          const element = getElement(target) as Element;
          return element && !element.contains(event.target as Node);
        });

        if (isClickedOutsideElements) internalCallbackRef.current(event);

        return;
      }

      const element = (target ? getElement(target) : internalRef) as Element;

      if (element && !element.contains(event.target as Node)) {
        internalCallbackRef.current(event);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [internalRef, target]);

  if (target) return;
  return setInternalRef;
}) as UseClickOutside;
