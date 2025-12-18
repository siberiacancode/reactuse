import { useEffect, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use keys pressed options type */
export interface UseKeysPressedOptions {
  /** Enable or disable the event listeners */
  enabled?: boolean;
}

export interface UseKeysPressed {
  (
    target: HookTarget | Window,
    options?: UseKeysPressedOptions
  ): Array<{
    key: string;
    code: string;
  }>;

  <Target extends Element>(
    options?: UseKeysPressedOptions
  ): {
    value: Array<{ key: string; code: string }>;
    ref: StateRef<Target>;
  };
}

/**
 * @name useKeysPressed
 * @description Tracks all currently pressed keyboard keys and their codes
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget | Window} target DOM element or ref to attach keyboard listeners to
 * @param {UseKeysPressedOptions} [options.enabled=true] Enable or disable the event listeners
 * @returns {Array<{ key: string; code: string }>} Array of currently pressed keys with their key and code values
 *
 * @example
 * const pressedKeys = useKeysPressed(ref);
 *
 * @overload
 * @template Target - Type of the target DOM element
 * @param {UseKeysPressedOptions} [options] - Optional configuration options
 * @returns {{ keys: Array<{ key: string; code: string }>; ref: StateRef<Target> }} Object containing pressed keys array and ref to attach to a DOM element
 *
 * @example
 * const { value, ref } = useKeysPressed();
 */
export const useKeysPressed = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseKeysPressedOptions | undefined;

  const enabled = options?.enabled ?? true;
  const [value, setValue] = useState<{ key: string; code: string }[]>([]);
  const internalRef = useRefState(window);

  useEffect(() => {
    if (!enabled) return;
    setValue([]);

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const onKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      setValue((prevValue) => {
        if (prevValue.some(({ code }) => code === keyboardEvent.code)) return prevValue;
        return [...prevValue, { key: keyboardEvent.key, code: keyboardEvent.code }];
      });
    };

    const onKeyUp = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      setValue((prevValue) => prevValue.filter(({ code }) => code !== keyboardEvent.code));
    };

    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);

    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled, internalRef.state, target, isTarget.getRefState(target)]);

  if (target) return value;
  return { value, ref: internalRef };
}) as UseKeysPressed;
