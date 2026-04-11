import { useEffect, useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useEventListener
 * @description - Hook that attaches an event listener to the specified target
 * @category Browser
 * @usage necessary

 * @overload
 * @template Event Key of window event map
 * @param {Window} target The window object to attach the event listener to
 * @param {Event | Event[]} event An array of event types to listen for
 * @param {(this: Window, event: WindowEventMap[Event]) => void} handler The event handler function
 * @param {UseEventListenerOptions} [options] Options for the event listener
 * @returns {void}
 *
 * @example
 * useEventListener(window, 'click', () => console.log('click'));
 *
 * @overload
 * @template Event Key of window event map
 * @param {Document} target The window object to attach the event listener to
 * @param {Event | Event[]} event An array of event types to listen for
 * @param {(this: Document, event: DocumentEventMap[Event]) => void} handler The event handler function
 * @param {UseEventListenerOptions} [options] Options for the event listener
 * @returns {void}
 *
 * @example
 * useEventListener(document, 'click', () => console.log('click'));
 *
 * @overload
 * @template Event Key of window event map
 * @template Target The target element
 * @param {HookTarget} target The target element to attach the event listener to
 * @param {Event | Event[]} event An array of event types to listen for
 * @param {(this: Target, event: HTMLElementEventMap[Event]) => void} handler The event handler function
 * @param {UseEventListenerOptions} [options] Options for the event listener
 * @returns {void}
 *
 * @example
 * useEventListener(ref, 'click', () => console.log('click'));
 *
 * @overload
 * @template Event Key of window event map
 * @template Target The target element
 * @param {Event | Event[]} event An array of event types to listen for
 * @param {(this: Target, event: HTMLElementEventMap[Event] | MediaQueryListEventMap[Event]) => void} handler The event handler function
 * @param {UseEventListenerOptions} [options] Options for the event listener
 * @returns {UseEventListenerReturn<Target>} A reference to the target element
 *
 * @example
 * const ref = useEventListener('click', () => console.log('click'));
 */
export const useEventListener = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const event = target ? params[1] : params[0];
  const listener = target ? params[2] : params[1];
  const options = target ? params[3] : params[2];
  const enabled = options?.enabled ?? true;
  const internalRef = useRefState();
  const internalListenerRef = useRef(listener);
  internalListenerRef.current = listener;
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  useEffect(() => {
    if (!enabled) return;
    const element = (target ? isTarget.getElement(target) : internalRef.current) ?? window;
    const listener = (event) => internalListenerRef.current(event);
    element.addEventListener(event, listener, options);
    return () => {
      element.removeEventListener(event, listener, options);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, event, enabled]);
  if (target) return;
  return internalRef;
};
