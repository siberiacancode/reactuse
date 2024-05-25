import React from 'react';

import type { UseEventListenerTarget } from '../useEventListener/useEventListener';
import { useEventListener } from '../useEventListener/useEventListener';

export type UseKeyPressKey = string | string[];

export type UseKeyPressOptions = {
  target: UseEventListenerTarget;
};

export const useKeyPress = (key: UseKeyPressKey, options?: UseKeyPressOptions) => {
  const [pressed, setPressed] = React.useState(false);

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
