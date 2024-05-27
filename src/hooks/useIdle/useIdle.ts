import React from 'react';

import { throttle } from '@/utils/helpers';

interface UseIdleOptions {
  initialState?: boolean;
  events?: Array<keyof WindowEventMap>;
}

const IDLE_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'wheel',
  'resize'
] satisfies Array<keyof WindowEventMap>;
const ONE_MINUTE = 60e3;

export const useIdle = (
  milliseconds = ONE_MINUTE,
  { initialState = false, events = IDLE_EVENTS }: UseIdleOptions = {}
) => {
  const [idle, setIdle] = React.useState(initialState);
  const [lastActive, setLastActive] = React.useState(Date.now());

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const onTimeout = () => setIdle(true);

    const onEvent = throttle(() => {
      setIdle(false);
      setLastActive(Date.now());
      window.clearTimeout(timeoutId);
      timeoutId = setTimeout(onTimeout, milliseconds);
    }, 500);

    const onVisibilitychange = () => {
      if (!document.hidden) onEvent();
    };

    timeoutId = setTimeout(onTimeout, milliseconds);

    events.forEach((event) => window.addEventListener(event, onEvent));
    document.addEventListener('visibilitychange', onVisibilitychange);

    return () => {
      events.forEach((event) => window.addEventListener(event, onEvent));
      document.removeEventListener('visibilitychange', onVisibilitychange);
      window.clearTimeout(timeoutId);
    };
  }, [milliseconds, events]);

  return { idle, lastActive };
};
