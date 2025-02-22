import { useState } from 'react';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';
import { useEventListener } from '../useEventListener/useEventListener';
/**
 * @name useKeysPressed
 * @description - Hook for get keys that were pressed
 * @category Sensors
 *
 * @param {UseEventListenerTarget} [params.target] The target to attach the event listeners to
 * @param {boolean} [params.enabled] Enable or disable the event listeners
 * @returns {useKeysPressedReturns} Array of strings with keys that were press
 *
 * @example
 * const pressedKeys = useKeysPressed();
 */
export const useKeysPressed = (params) => {
  const enabled = params?.enabled ?? true;
  const [keys, setKeys] = useState([]);
  const onKeyDown = (event) => {
    if (!enabled) return;
    setKeys((prevKeys) => {
      if (prevKeys.some(({ code }) => code === event.code)) return prevKeys;
      return [...prevKeys, { key: event.key, code: event.code }];
    });
  };
  const onKeyUp = (event) => {
    if (!enabled) return;
    setKeys((prevKeys) => prevKeys.filter(({ code }) => code !== event.code));
  };
  useDidUpdate(() => {
    setKeys([]);
  }, [enabled]);
  useEventListener(params?.target ?? window, 'keydown', onKeyDown);
  useEventListener(params?.target ?? window, 'keyup', onKeyUp);
  return keys;
};
