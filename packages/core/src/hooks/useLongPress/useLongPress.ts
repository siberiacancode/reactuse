import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

export type LongPressEvents = MouseEvent | TouchEvent;

// * The use long press options type */
export interface UseLongPressOptions {
  // * The threshold time in milliseconds
  threshold?: number;
  // * The callback function to be invoked on long press cancel
  onCancel?: (event: LongPressEvents) => void;
  // * The callback function to be invoked on long press end
  onFinish?: (event: LongPressEvents) => void;
  // * The callback function to be invoked on long press start
  onStart?: (event: LongPressEvents) => void;
}

export interface UseLongPress {
  (
    target: HookTarget,
    callback: (event: LongPressEvents) => void,
    options?: UseLongPressOptions
  ): boolean;

  <Target extends Element>(
    callback: (event: LongPressEvents) => void,
    options?: UseLongPressOptions,
    target?: never
  ): {
    ref: StateRef<Target>;
    pressed: boolean;
  };
}

const DEFAULT_THRESHOLD_TIME = 400;

/**
 * @name useLongPress
 * @description - Hook that defines the logic when long pressing an element
 * @category Sensors
 *
 * @overload
 * @param {HookTarget} target The target element to be long pressed
 * @param {(event: LongPressEvents) => void} callback The callback function to be invoked on long press
 * @param {UseLongPressOptions} [options] The options for the long press
 * @returns {boolean} The long pressing state
 *
 * @example
 * const pressed = useLongPress(ref, () => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {(event: LongPressEvents) => void} callback The callback function to be invoked on long press
 * @param {UseLongPressOptions} [options] The options for the long press
 * @returns {boolean} The long pressing state
 *
 * @example
 * const { ref, pressed } = useLongPress(() => console.log('callback'));
 */
export const useLongPress = ((...params: any[]): any => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (target ? params[1] : params[0]) as (event: LongPressEvents) => void;
  const options = (target ? params[2] : params[1]) as UseLongPressOptions | undefined;

  const [pressed, setPressed] = useState(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isPressedRef = useRef(false);
  const internalRef = useRefState<Element>();

  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;

    const onStart = (event: LongPressEvents) => {
      internalOptionsRef.current?.onStart?.(event);

      isPressedRef.current = true;
      timeoutIdRef.current = setTimeout(() => {
        internalCallbackRef.current(event);
        setPressed(true);
      }, internalOptionsRef.current?.threshold ?? DEFAULT_THRESHOLD_TIME);
    };

    const onCancel = (event: LongPressEvents) => {
      setPressed((prevPressed) => {
        if (prevPressed) {
          internalOptionsRef.current?.onFinish?.(event);
        } else if (isPressedRef.current) {
          internalOptionsRef.current?.onCancel?.(event);
        }

        return false;
      });

      isPressedRef.current = false;
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };

    element.addEventListener('mousedown', onStart as EventListener);
    element.addEventListener('touchstart', onStart as EventListener);
    element.addEventListener('mouseup', onCancel as EventListener);
    element.addEventListener('touchend', onCancel as EventListener);
    window.addEventListener('mouseup', onCancel as EventListener);
    window.addEventListener('touchend', onCancel as EventListener);

    return () => {
      element.removeEventListener('mousedown', onStart as EventListener);
      element.removeEventListener('touchstart', onStart as EventListener);
      element.removeEventListener('mouseup', onCancel as EventListener);
      element.removeEventListener('touchend', onCancel as EventListener);
      window.removeEventListener('mouseup', onCancel as EventListener);
      window.removeEventListener('touchend', onCancel as EventListener);

      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [target, internalRef.state]);

  if (target) return pressed;
  return {
    ref: internalRef,
    pressed
  };
}) as UseLongPress;
