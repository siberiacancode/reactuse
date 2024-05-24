import React from 'react';

import { useEventListener } from '../useEventListener/useEventListener';

export const useKeyPress = (key: string) => {
  const [pressed, setPressed] = React.useState(false);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === key) setPressed(true);
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === key) setPressed(false);
  };

  useEventListener('keydown', onKeyDown);
  useEventListener('keyup', onKeyUp);

  return pressed;
};
