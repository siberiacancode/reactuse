import type { UseEventListenerOptions } from '../useEventListener/useEventListener';
import { useEventListener } from '../useEventListener/useEventListener';

export const useWindowEvent = <Event extends keyof WindowEventMap>(
  event: Event,
  listener: (this: Window, event: WindowEventMap[Event]) => any,
  options?: UseEventListenerOptions
) => useEventListener(window, event, listener, options);
