import React from 'react';

import { useEvent } from '../useEvent/useEvent';

/** The use event listener target element type */
export type UseEventListenerTarget =
  | React.RefObject<Element | null>
  | (() => Element)
  | Element
  | Window
  | Document;

/** Function to get target element based on its type */
const getElement = (target: UseEventListenerTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element || target instanceof Window || target instanceof Document) {
    return target;
  }

  return target.current;
};

/** The use event listener options */
export type UseEventListenerOptions = boolean | AddEventListenerOptions;

/** The use event listener return type */
export type UseEventListenerReturn<Target extends UseEventListenerTarget> = React.RefObject<Target>;

export type UseEventListener = {
  <Event extends keyof WindowEventMap = keyof WindowEventMap>(
    target: Window,
    event: Event | Event[],
    listener: (this: Window, event: WindowEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Event extends keyof DocumentEventMap = keyof DocumentEventMap>(
    target: Document,
    event: Event | Event[],
    listener: (this: Document, event: DocumentEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <
    Target extends UseEventListenerTarget,
    Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap
  >(
    target: Target,
    event: Event | Event[],
    listener: (this: Target, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Target extends Element, Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(
    event: Event | Event[],
    listener: (this: Target, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions,
    target?: never
  ): UseEventListenerReturn<Target>;

  <
    Target extends Element,
    Event extends keyof MediaQueryListEventMap = keyof MediaQueryListEventMap
  >(
    event: Event | Event[],
    listener: (this: Target, event: MediaQueryListEventMap[Event]) => void,
    options?: UseEventListenerOptions,
    target?: never
  ): UseEventListenerReturn<Target>;
};

/**
 * @name useEventListener
 * @description - Hook to handle events on elements
 *
 * @overload
 * @template Event
 * @param {Window} target The target element to handle events for
 * @param {Event | Event[]} event The event(s) to handle
 * @param {(this: Window, event: WindowEventMap[Event]) => void} listener The callback to execute when an event is detected
 * @param {UseEventListenerOptions} options The options for the event listener
 * @returns {void}
 *
 * @example
 * useEventListener(window, 'click', (event) => console.log('click', event.target));
 *
 * @overload
 * @template Event The target element
 * @param {Document} target The target element to handle events for
 * @param {Event | Event[]} event The event(s) to handle
 * @param {(this: Document, event: DocumentEventMap[Event]) => void} listener The callback to execute when an event is detected
 * @param {UseEventListenerOptions} options The options for the event listener
 * @returns {void}
 *
 * @example
 * useEventListener(document, 'click', (event) => console.log('click', event.target));
 *
 * @overload
 * @template Target
 * @template Event The target element
 * @param {Target} target The target element to handle events for
 * @param {Event | Event[]} event The event(s) to handle
 * @param {(this: Target, event: HTMLElementEventMap[Event]) => void} listener The callback to execute when an event is detected
 * @param {UseEventListenerOptions} options The options for the event listener
 * @returns {void}
 *
 * @example
 * useEventListener(document.createElement('div'), 'click', (event) => console.log('click', event.target));
 *
 * @overload
 * @template Target
 * @template Event The target element
 * @param {Event | Event[]} event The event(s) to handle
 * @param {(this: Target, event: HTMLElementEventMap[Event]) => void} listener The callback to execute when an event is detected
 * @param {UseEventListenerOptions} options The options for the event listener
 * @returns {UseEventListenerReturn<Target>}
 *
 * @example
 * const ref = useEventListener('click', (event) => console.log('click', event.target));
 *
 * @overload
 * @template Target
 * @template Event The target element
 * @param {Event | Event[]} event The event(s) to handle
 * @param {(this: Target, event: HTMLElementEventMap[Event]) => void} listener The callback to execute when an event is detected
 * @param {UseEventListenerOptions} options The options for the event listener
 * @returns {UseEventListenerReturn<Target>}
 *
 * @example
 * const ref = useEventListener('click', (event) => console.log('click', event.target));
 */
export const useEventListener = ((...params: any[]) => {
  const target = (params[1] instanceof Function ? null : params[0]) as
    | UseEventListenerTarget
    | undefined;
  const event = (target ? params[1] : params[0]) as string | string[];
  const events = Array.isArray(event) ? event : [event];
  const listener = (target ? params[2] : params[1]) as (...arg: any[]) => void;
  const options: UseEventListenerOptions | undefined = target ? params[3] : params[2];

  const internalRef = React.useRef<Element | Document | Window>(null);
  const internalListener = useEvent(listener);

  React.useEffect(() => {
    const callback = (event: Event) => internalListener(event);
    const element = target ? getElement(target) : internalRef.current;
    if (element) {
      events.forEach((event) => element.addEventListener(event, callback, options));
      return () => {
        events.forEach((event) => element.removeEventListener(event, callback, options));
      };
    }
  }, [target, event, options]);

  if (target) return;
  return internalRef;
}) as UseEventListener;
