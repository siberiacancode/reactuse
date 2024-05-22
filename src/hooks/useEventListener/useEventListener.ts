import React from 'react';

type UseEventListenerTarget =
  | React.RefObject<HTMLElement | null>
  | (() => Element)
  | Element
  | Window
  | Document;

const getElement = (target: UseEventListenerTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element || target instanceof Window || target instanceof Document) {
    return target;
  }

  return target.current;
};

export type UseEventListenerOptions = boolean | AddEventListenerOptions;

export type UseEventListenerReturn<Target extends UseEventListenerTarget = any> =
  React.RefObject<Target>;

export type UseEventListener = {
  <Event extends keyof WindowEventMap = keyof WindowEventMap>(
    target: Window,
    event: Event,
    listener: (this: Window, event: WindowEventMap[Event]) => any,
    options?: UseEventListenerOptions
  ): void;

  <Event extends keyof DocumentEventMap = keyof DocumentEventMap>(
    target: Document,
    event: Event,
    listener: (this: Document, event: DocumentEventMap[Event]) => any,
    options?: UseEventListenerOptions
  ): void;

  <
    Target extends UseEventListenerTarget,
    Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap
  >(
    target: Target,
    event: Event,
    listener: (this: Target, event: HTMLElementEventMap[Event]) => any,
    options?: UseEventListenerOptions
  ): void;

  <Target extends Element, Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(
    event: Event,
    listener: (this: Target, event: HTMLElementEventMap[Event]) => any,
    options?: UseEventListenerOptions,
    target?: never
  ): UseEventListenerReturn<Target>;
};

/**
 * @name useEventListener
 * @description - Hook that manages a counter with increment, decrement, reset, and set functionalities
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter(5);
 */
export const useEventListener = ((...params: any[]) => {
  const target = (typeof params[3] === 'undefined' ? null : params[0]) as
    | UseEventListenerTarget
    | undefined;
  const event = (target ? params[0] : params[1]) as string;
  const listener = (target ? params[1] : params[2]) as (...arg: any[]) => any;
  const options: UseEventListenerOptions | undefined = target ? params[2] : params[3];

  const internalRef = React.useRef<Element | Document | Window>(null);

  React.useEffect(() => {
    const element = target ? getElement(target) : internalRef.current;
    if (element) {
      element.addEventListener(event, listener, options);
      return () => element.removeEventListener(event, listener, options);
    }
    return undefined;
  }, [event, listener, options]);

  if (target) return;
  return internalRef;
}) as UseEventListener;
