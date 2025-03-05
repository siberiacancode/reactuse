import { useEffect } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The keyboard event handler type */
export type KeyboardEventHandler = (event: KeyboardEvent) => void;

/** The use keyboard options type */
export interface UseKeyboardOptions {
  /** The callback function to be invoked on key down */
  onKeyDown?: KeyboardEventHandler;
  /** The callback function to be invoked on key up */
  onKeyUp?: KeyboardEventHandler;
}

export interface UseKeyboard {
  (target: HookTarget | Window, options: UseKeyboardOptions): void;

  <Target extends Element>(options: UseKeyboardOptions, target?: never): { ref: StateRef<Target> };
}

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
export const useKeyboard = ((...params: any[]) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = (target ? params[1] : params[0]) as UseKeyboardOptions;

  const internalRef = useRefState(window);

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const onKeyDown = (event: Event) => options?.onKeyDown?.(event as KeyboardEvent);
    const onKeyUp = (event: Event) => options?.onKeyUp?.(event as KeyboardEvent);

    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);

    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [target, internalRef.state]);

  if (target) return;
  return internalRef;
}) as UseKeyboard;
