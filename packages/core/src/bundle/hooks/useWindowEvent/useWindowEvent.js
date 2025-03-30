import { target } from '@/utils/helpers';
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
export const useWindowEvent = (event, listener, options) =>
  useEventListener(target(window), event, listener, options);
