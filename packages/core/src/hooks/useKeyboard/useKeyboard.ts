import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use keyboard event handler type */
export type KeyboardEventHandler = (event: KeyboardEvent) => void;

/** The use keyboard event options type */
export interface UseKeyboardEventOptions {
  /** The callback function to be invoked on key down */
  onKeyDown?: KeyboardEventHandler;
  /** The callback function to be invoked on key up */
  onKeyUp?: KeyboardEventHandler;
}

export interface UseKeyboard {
  (target: HookTarget, callback: KeyboardEventHandler): void;

  (target: HookTarget, options: UseKeyboardEventOptions): void;

  <Target extends HTMLElement>(
    callback: KeyboardEventHandler,
    target?: never
  ): { ref: StateRef<Target> };

  <Target extends HTMLElement>(
    options: UseKeyboardEventOptions,
    target?: never
  ): {
    ref: StateRef<Target>;
  };
}

/**
 * @name useKeyboard
 * @description - Hook that helps to listen for keyboard events
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target to attach the event listeners to
 * @param {KeyboardEventHandler} callback The callback function to be invoked on key down
 * @returns {void}
 *
 * @example
 * useKeyboard(ref, (event) => console.log('key down'));
 *
 * @overload
 * @param {HookTarget} target The target to attach the event listeners to
 * @param {UseKeyboardEventOptions} [options] The keyboard event options
 * @returns {void}
 *
 * @example
 * useKeyboard(ref, { onKeyDown: (event) => console.log('key down'), onKeyUp: (event) => console.log('key up') });
 *
 * @overload
 * @template Target The target element type
 * @param {KeyboardEventHandler} callback The callback function to be invoked on key down
 * @returns {{ ref: StateRef<Target> }} An object containing the ref
 *
 * @example
 * const ref = useKeyboard((event) => console.log('key down'));
 *
 * @overload
 * @template Target The target element type
 * @param {UseKeyboardEventOptions} [options] The keyboard event options
 * @returns {{ ref: StateRef<Target> }} An object containing the ref
 *
 * @example
 * const ref = useKeyboard({ onKeyDown: (event) => console.log('key down'), onKeyUp: (event) => console.log('key up') });
 */
export const useKeyboard = ((...params: any[]) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onKeyDown: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onKeyDown: params[0] }
  ) as UseKeyboardEventOptions;

  const internalRef = useRefState(window);
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as HTMLElement;
    if (!element) return;

    const onKeyDown = (event: Event) =>
      internalOptionsRef.current?.onKeyDown?.(event as KeyboardEvent);
    const onKeyUp = (event: Event) => internalOptionsRef.current?.onKeyUp?.(event as KeyboardEvent);

    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);

    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [target, internalRef.state, isTarget.getRefState(target)]);

  if (target) return;
  return internalRef;
}) as UseKeyboard;
