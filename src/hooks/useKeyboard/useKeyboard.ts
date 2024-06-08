import type { UseEventListenerTarget } from '../useEventListener/useEventListener';
import { useEventListener } from '../useEventListener/useEventListener';

/** The use key press options type */
export type UseKeyboardParams = {
  /** The target to attach the event listeners to */
  target?: UseEventListenerTarget;
  /** The callback function to be invoked on key down */
  onKeyDown?: (event: KeyboardEvent) => void;
  /** The callback function to be invoked on key up */
  onKeyUp?: (event: KeyboardEvent) => void;
};

/**
 * @name useKeyboard
 * @description - Hook that listens for key press events
 *
 * @param {UseEventListenerTarget} [target=window] The target to attach the event listeners to
 * @param {(event: KeyboardEvent) => void} [onKeyDown] The callback function to be invoked on key down
 * @param {(event: KeyboardEvent) => void} [onKeyUp] The callback function to be invoked on key up
 *
 * @example
 * useKeyboard({ onKeyDown: () => console.log('key down'), onKeyUp: () => console.log('key up') })
 */
export const useKeyboard = (params?: UseKeyboardParams) => {
  const onKeyDown = (event: KeyboardEvent) => params?.onKeyDown?.(event);
  const onKeyUp = (event: KeyboardEvent) => params?.onKeyUp?.(event);

  useEventListener(params?.target ?? window, 'keydown', onKeyDown);
  useEventListener(params?.target ?? window, 'keyup', onKeyUp);
};
