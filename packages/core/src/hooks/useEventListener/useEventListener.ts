import type { RefObject } from 'react';

import { useEffect } from 'react';

import { getElement } from '@/utils/helpers';

import { useEvent } from '../useEvent/useEvent';
import { useRefState } from '../useRefState/useRefState';

/** The use event listener target type */
export type UseEventListenerTarget =
  | string
  | Document
  | Element
  | RefObject<Element | null | undefined>
  | Window;

/** The use event listener options */
export type UseEventListenerOptions = boolean | AddEventListenerOptions;

/** The use event listener return type */
export type UseEventListenerReturn<Target extends UseEventListenerTarget> = RefObject<Target>;

export interface UseEventListener {
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
}

/**
 * @name useEventListener
 * @description - Hook that attaches an event listener to the specified target
 * @category Browser
 *
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
 * @param {Target} target The target element to attach the event listener to
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
export const useEventListener = ((...params: any[]) => {
  const target = (params[1] instanceof Function ? undefined : params[0]) as
    | UseEventListenerTarget
    | undefined;
  const event = (target ? params[1] : params[0]) as string | string[];
  const events = Array.isArray(event) ? event : [event];
  const listener = (target ? params[2] : params[1]) as (...arg: any[]) => undefined | void;
  const options = (target ? params[3] : params[2]) as UseEventListenerOptions | undefined;

  const internalRef = useRefState(window);
  const internalListener = useEvent(listener);

  useEffect(() => {
    const callback = (event: Event) => internalListener(event);
    const element = target ? getElement(target) : internalRef.current;

    if (!element) return;

    events.forEach((event) => element.addEventListener(event, callback, options));
    return () => {
      events.forEach((event) => element.removeEventListener(event, callback, options));
    };
  }, [target, internalRef.current, event, options]);

  if (target) return;
  return internalRef;
}) as UseEventListener;
