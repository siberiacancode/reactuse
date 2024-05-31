import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

/** The use click outside target element type */
type UseClickOutsideTarget = React.RefObject<Element | null> | (() => Element) | Element;

/** Function to get target element based on its type */
const getElement = (target: UseClickOutsideTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

/** The use click outside return type */
export type UseClickOutsideReturn<Target extends UseClickOutsideTarget | UseClickOutsideTarget[]> =
  React.RefObject<Target>;

/** The use click outside type defenition */
export type UseClickOutside = {
  <Target extends UseClickOutsideTarget | UseClickOutsideTarget[]>(
    target: Target,
    callback: (event: Event) => void
  ): void;

  <Target extends UseClickOutsideTarget | UseClickOutsideTarget[]>(
    callback: (event: Event) => void,
    target?: never
  ): UseClickOutsideReturn<Target>;
};

/**
 * @name useClickOutside
 * @description - Hook to handle click events outside the specified target element(s).
 *
 * @overload
 * @param {Target} target - The target element(s) to detect outside clicks for.
 * @param {(event: Event) => void} callback - The callback to execute when a click outside the target is detected.
 * @returns {void}
 *
 * @overload
 * @param {(event: Event) => void} callback - The callback to execute when a click outside the target is detected.
 * @param {never} [target] - Optional parameter, not used in this overload.
 * @returns {UseClickOutsideReturn<Target>} - A React ref to attach to the target element.
 *
 * @example
 * const ref = useClickOutside<HMLDiTvElement>((event) => {
 *   console.log('@click outside 1', event.target);
 * });
 *
 * @example
 * useClickOutside(
 *   () => document.getElementById('content')!,
 *   (event) => {
 *     console.log('@click outside 2', event.target);
 *   }
 * );
 */
export const useClickOutside = ((...params: any[]) => {
  const target = (typeof params[1] === 'undefined' ? undefined : params[0]) as
    | UseClickOutsideTarget
    | Array<UseClickOutsideTarget>
    | undefined;
  const callback = (params[1] ? params[1] : params[0]) as (event: Event) => void;

  const internalRef = React.useRef<Element>(null);
  const internalCallbackRef = React.useRef(callback);

  useIsomorphicLayoutEffect(() => {
    internalCallbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const handler = (event: Event) => {
      if (Array.isArray(target)) {
        if (!target.length) return;

        target.forEach((target) => {
          const element = getElement(target);

          if (element && !element.contains(event.target as Node)) {
            internalCallbackRef.current(event);
          }
        });

        return;
      }

      const element = target ? getElement(target) : internalRef.current;

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
  }, []);

  if (target) return;
  return internalRef;
}) as UseClickOutside;
