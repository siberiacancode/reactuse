import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

export interface UseClickOutside {
  (target: HookTarget, callback: (event: Event) => void): void;

  <Target extends Element>(callback: (event: Event) => void, target?: never): StateRef<Target>;
}

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
 * @returns {(node: Target) => void} A React ref to attach to the target element
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => console.log('click outside'));
 *
 * @see {@link https://siberiacancode.github.io/reactuse/functions/hooks/useClickOutside.html}
 */
export const useClickOutside = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (params[1] ? params[1] : params[0]) as (event: Event) => void;

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!target && !internalRef.state) return;
    const onClick = (event: Event) => {
      const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;

      if (element && !element.contains(event.target as Node)) {
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
}) as UseClickOutside;
