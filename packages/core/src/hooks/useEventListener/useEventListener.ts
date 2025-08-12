import { useEffect } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useEvent } from '../useEvent/useEvent';
import { useRefState } from '../useRefState/useRefState';

/** The use event listener options */
export type UseEventListenerOptions = boolean | AddEventListenerOptions;

/** The use event listener return type */
export type UseEventListenerReturn<Target extends Element> = StateRef<Target>;

export interface UseEventListener {
  <Event extends keyof WindowEventMap = keyof WindowEventMap>(
    target: HookTarget,
    event: Event,
    listener: (this: Window, event: WindowEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Event extends keyof DocumentEventMap = keyof DocumentEventMap>(
    target: HookTarget,
    event: Event,
    listener: (this: Document, event: DocumentEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(
    target: HookTarget,
    event: Event,
    listener: (this: Element, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Target extends Element, Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(
    event: Event,
    listener: (this: Target, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions,
    target?: never
  ): UseEventListenerReturn<Target>;

  <
    Target extends Element,
    Event extends keyof MediaQueryListEventMap = keyof MediaQueryListEventMap
  >(
    event: Event,
    listener: (this: Target, event: MediaQueryListEventMap[Event]) => void,
    options?: UseEventListenerOptions,
    target?: never
  ): UseEventListenerReturn<Target>;
}

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
export const useEventListener = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const event = (target ? params[1] : params[0]) as string;
  const listener = (target ? params[2] : params[1]) as (...arg: any[]) => undefined | void;
  const options = (target ? params[3] : params[2]) as UseEventListenerOptions | undefined;

  const internalRef = useRefState(window);
  const internalListener = useEvent(listener);

  useEffect(() => {
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;

    const callback = (event: Event) => internalListener(event);

    element.addEventListener(event, callback, options);
    return () => {
      element.removeEventListener(event, callback, options);
    };
  }, [target, internalRef.state, event, options]);

  if (target) return;
  return internalRef;
}) as UseEventListener;
