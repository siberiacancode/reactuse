import { useState } from 'react';

import type { UseEventListenerTarget } from '../useEventListener/useEventListener';

import { useEventListener } from '../useEventListener/useEventListener';

/** The key or keys to listen for */
export type UseKeyPressKey = string | string[];

/** The use key press options type */
export interface UseKeyPressOptions {
  /** The target to attach the event listeners to */
  target?: UseEventListenerTarget;
}

/**
 * @name useKeyPress
 * @description - Hook that listens for key press events
 * @category Sensors
 *
 * @param {UseKeyPressKey} key The key or keys to listen for
 * @param {UseEventListenerTarget} [options.target=window] The target to attach the event listeners to
 * @returns {useKeyPressReturns} Return boolean type (`true` if the specified keys are currently pressed)
 *
 * @example
 * const isKeyPressed = useKeyPress('a');
 */
export const useKeyPress = (key: UseKeyPressKey, options?: UseKeyPressOptions) => {
  const [pressed, setPressed] = useState(false);

  const onKeyDown = (event: KeyboardEvent) => {
    if (Array.isArray(key) ? key.includes(event.key) : event.key === key) setPressed(true);
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (Array.isArray(key) ? key.includes(event.key) : event.key === key) setPressed(false);
  };

  useEventListener(options?.target ?? window, 'keydown', onKeyDown);
  useEventListener(options?.target ?? window, 'keyup', onKeyUp);

  return pressed;
};
