import type { UseEventListenerOptions } from '../useEventListener/useEventListener';

import { useEventListener } from '../useEventListener/useEventListener';

/**
 * @name useWindowEvent
 * @description - Hook attaches an event listener to the window object for the specified event
 * @category Browser
 *
 * @template Event Key of window event map.
 * @param {Event} event The event to listen for.
 * @param {(event: WindowEventMap[Event]) => void} listener The callback function to be executed when the event is triggered
 * @param {UseEventListenerOptions} [options] The options for the event listener
 * @returns {void}
 *
 * @example
 * useWindowEvent('click', () => console.log('clicked'));
 */
export const useWindowEvent = <Event extends keyof WindowEventMap>(
  event: Event,
  listener: (this: Window, event: WindowEventMap[Event]) => any,
  options?: UseEventListenerOptions
) => useEventListener(window, event, listener, options);
