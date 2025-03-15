import { useEffect, useRef, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useKeyPress
 * @description - Hook that listens for key press events
 * @category Sensors
 *
 * @overload
 * @param {HookTarget} [target=window] The target to attach the event listeners to
 * @param {UseKeyPressKey} key The key or keys to listen for
 * @param {(pressed: boolean, event: KeyboardEvent) => void} [callback] Callback function invoked when key is pressed
 * @returns {boolean} The pressed state of the key
 *
 * @example
 * const isKeyPressed = useKeyPress('a', window);
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
export const useKeyPress = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const key = target ? params[1] : params[0];
  const callback = target ? params[2] : params[1];
  const [pressed, setPressed] = useState(false);
  const internalRef = useRefState(window);
  const keyRef = useRef(key);
  keyRef.current = key;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    const onKeyDown = (event) => {
      const keyboardEvent = event;
      if (
        Array.isArray(keyRef.current)
          ? keyRef.current.includes(keyboardEvent.key)
          : keyboardEvent.key === keyRef.current
      ) {
        setPressed(true);
        callbackRef.current?.(true, keyboardEvent);
      }
    };
    const onKeyUp = (event) => {
      const keyboardEvent = event;
      if (
        Array.isArray(keyRef.current)
          ? keyRef.current.includes(keyboardEvent.key)
          : keyboardEvent.key === keyRef.current
      ) {
        setPressed(false);
        callbackRef.current?.(false, keyboardEvent);
      }
    };
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);
    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [target, internalRef.state]);
  if (target) return pressed;
  return { pressed, ref: internalRef };
};
