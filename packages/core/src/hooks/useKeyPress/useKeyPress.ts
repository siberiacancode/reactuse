import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The key or keys to listen for */
export type UseKeyPressKey = string | string[];

/** The callback function to be invoked when key is pressed */
export type UseKeyPressCallback = (pressed: boolean, event: KeyboardEvent) => void;

export interface UseKeyPress {
  (target: HookTarget | Window, key: UseKeyPressKey, callback?: UseKeyPressCallback): boolean;

  <Target extends Element>(
    key: UseKeyPressKey,
    callback?: UseKeyPressCallback,
    target?: never
  ): { pressed: boolean; ref: StateRef<Target> };
}

/**
 * @name useKeyPress
 * @description - Hook that listens for key press events
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @param {HookTarget} [target=window] The target to attach the event listeners to
 * @param {UseKeyPressKey} key The key or keys to listen for
 * @param {(pressed: boolean, event: KeyboardEvent) => void} [callback] Callback function invoked when key is pressed
 * @returns {boolean} The pressed state of the key
 *
 * @example
 * const isKeyPressed = useKeyPress(ref, 'a');
 *
 * @overload
 * @template Target The target element type
 * @param {UseKeyPressKey} key The key or keys to listen for
 * @param {(pressed: boolean, event: KeyboardEvent) => void} [callback] Callback function invoked when key is pressed
 * @returns {{ pressed: boolean; ref: StateRef<Target> }} An object containing the pressed state and ref
 *
 * @example
 * const { pressed, ref } = useKeyPress('a');
 */
export const useKeyPress = ((...params: any[]) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const key = (target ? params[1] : params[0]) as UseKeyPressKey;
  const callback = (target ? params[2] : params[1]) as UseKeyPressCallback | undefined;

  const [pressed, setPressed] = useState(false);
  const internalRef = useRefState(window);

  const keyRef = useRef(key);
  keyRef.current = key;
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const onKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (
        Array.isArray(keyRef.current)
          ? keyRef.current.includes(keyboardEvent.key)
          : keyboardEvent.key === keyRef.current
      ) {
        setPressed(true);
        internalCallbackRef.current?.(true, keyboardEvent);
      }
    };

    const onKeyUp = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (
        Array.isArray(keyRef.current)
          ? keyRef.current.includes(keyboardEvent.key)
          : keyboardEvent.key === keyRef.current
      ) {
        setPressed(false);
        internalCallbackRef.current?.(false, keyboardEvent);
      }
    };

    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);

    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return pressed;
  return { pressed, ref: internalRef };
}) as UseKeyPress;
