import { useState } from 'react';

import { useEventListener } from '../useEventListener/useEventListener';
/**
 * @name useKeyPress
 * @description - Hook that listens for key press events
 * @category Sensors
 *
 * @param {UseKeyPressKey} key The key or keys to listen for
 * @param {UseEventListenerTarget} [options.target] The target to attach the event listeners to
 * @returns {useKeyPressReturns} Return boolean type (`true` if the specified keys are currently pressed)
 *
 * @example
 * const isKeyPressed = useKeyPress('a');
 */
export const useKeyPress = (key, options) => {
  const [pressed, setPressed] = useState(false);
  const onKeyDown = (event) => {
    if (Array.isArray(key) ? key.includes(event.key) : event.key === key) setPressed(true);
  };
  const onKeyUp = (event) => {
    if (Array.isArray(key) ? key.includes(event.key) : event.key === key) setPressed(false);
  };
  useEventListener(options?.target ?? window, 'keydown', onKeyDown);
  useEventListener(options?.target ?? window, 'keyup', onKeyUp);
  return pressed;
};
