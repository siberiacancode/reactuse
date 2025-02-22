import { useEventListener } from '../useEventListener/useEventListener';
/**
 * @name useKeyboard
 * @description - Hook that help to listen for keyboard events
 * @category Sensors
 *
 * @param {UseEventListenerTarget} [target] The target to attach the event listeners to
 * @param {(event: KeyboardEvent) => void} [onKeyDown] The callback function to be invoked on key down
 * @param {(event: KeyboardEvent) => void} [onKeyUp] The callback function to be invoked on key up
 *
 * @example
 * useKeyboard({ onKeyDown: () => console.log('key down'), onKeyUp: () => console.log('key up') })
 */
export const useKeyboard = (params) => {
  const onKeyDown = (event) => params?.onKeyDown?.(event);
  const onKeyUp = (event) => params?.onKeyUp?.(event);
  useEventListener(params?.target ?? window, 'keydown', onKeyDown);
  useEventListener(params?.target ?? window, 'keyup', onKeyUp);
};
