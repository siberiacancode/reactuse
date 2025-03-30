import { target } from '@/utils/helpers';

import type { UseEventListenerOptions } from '../useEventListener/useEventListener';

import { useEventListener } from '../useEventListener/useEventListener';

/**
 * @name useDocumentEvent
 * @description - Hook attaches an event listener to the document object for the specified event
 * @category Browser
 *
 * @template Event Key of document event map.
 * @param {Event} event The event to listen for.
 * @param {(event: DocumentEventMap[Event]) => void} listener The callback function to be executed when the event is triggered
 * @param {UseEventListenerOptions} [options] The options for the event listener
 * @returns {void}
 *
 * @example
 * useDocumentEvent('click', () => console.log('clicked'));
 */
export const useDocumentEvent = <Event extends keyof DocumentEventMap>(
  event: Event,
  listener: (this: Document, event: DocumentEventMap[Event]) => any,
  options?: UseEventListenerOptions
) => useEventListener(target(document), event, listener, options);
