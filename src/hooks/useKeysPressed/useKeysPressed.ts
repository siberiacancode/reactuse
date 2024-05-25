import React from 'react';

import type { UseEventListenerTarget } from '../useEventListener/useEventListener';
import { useEventListener } from '../useEventListener/useEventListener';

/**
 * @name useKeysPressed
 * @description Hook that listens for key press events
 *
 * @param {UseEventListenerTarget} [target=window] The target to attach the event listeners to
 * @returns {useKeysPressedReturns} Array of strings with keys that were press
 *
 * @example
 * const pressedKeys = useKeysPressed();
 */
export const useKeysPressed = (target?: UseEventListenerTarget) => {
  const [keys, setKeys] = React.useState<string[]>([]);

  const onKeyDown = (event: KeyboardEvent) => setKeys([...keys, event.key]);
  const onKeyUp = (event: KeyboardEvent) => setKeys(keys.filter((key) => key !== event.key));

  useEventListener(target ?? window, 'keydown', onKeyDown);
  useEventListener(target ?? window, 'keyup', onKeyUp);

  return keys;
};
