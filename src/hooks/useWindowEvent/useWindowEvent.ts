import type { UseEventListenerOptions } from '../useEventListener/useEventListener';
import { useEventListener } from '../useEventListener/useEventListener';

/**
 * @name useWindowEvent
 * @description - Attaches an event listener to the window object for the specified event.
 *
 * @param {Event} event - The event to listen for.
 * @param {Function} listener - The callback function to be executed when the event is triggered.
 * @param {UseEventListenerOptions} [options] - Optional configuration options for the event listener.
 * @return {void}
 */
export const useWindowEvent = <Event extends keyof WindowEventMap>(
  event: Event,
  listener: (this: Window, event: WindowEventMap[Event]) => any,
  options?: UseEventListenerOptions
) => useEventListener(window, event, listener, options);
