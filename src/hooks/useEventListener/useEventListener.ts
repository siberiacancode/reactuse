import React from 'react';

export type UseEventListenerTarget =
  | React.RefObject<Element | null>
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
    listener: (this: Window, event: WindowEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Event extends keyof DocumentEventMap = keyof DocumentEventMap>(
    target: Document,
    event: Event,
    listener: (this: Document, event: DocumentEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <
    Target extends UseEventListenerTarget,
    Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap
  >(
    target: Target,
    event: Event,
    listener: (this: Target, event: HTMLElementEventMap[Event]) => void,
    options?: UseEventListenerOptions
  ): void;

  <Target extends Element, Event extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(
    event: Event,
    listener: (this: Target, event: HTMLElementEventMap[Event]) => void,
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
  const target = (params[1] instanceof Function ? null : params[0]) as
    | UseEventListenerTarget
    | undefined;
  const event = (target ? params[1] : params[0]) as string;
  const listener = (target ? params[2] : params[1]) as (...arg: any[]) => void;
  const options: UseEventListenerOptions | undefined = target ? params[3] : params[2];

  const internalRef = React.useRef<Element | Document | Window>(null);

  React.useEffect(() => {
    const element = target ? getElement(target) : internalRef.current;
    if (element) {
      element.addEventListener(event, listener, options);
      return () => element.removeEventListener(event, listener, options);
    }
    return undefined;
  }, [target, event, listener, options]);

  if (target) return;
  return internalRef;
}) as UseEventListener;
