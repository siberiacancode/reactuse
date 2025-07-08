import { useEffect, useRef, useState } from 'react';

/**
 * @name createEventEmitter
 * @description - Creates a type-safe event emitter
 * @category Helpers
 *
 * @template Events - The type of events and their data
 * @returns {Events} - Object containing event emitter methods and hook
 *
 * @example
 * const { instance, push, subscribe, unsubscribe, useSubscribe } = createEventEmitter<{ foo: number }>();
 */
export const createEventEmitter = <Events extends Record<string, any> = Record<string, any>>() => {
  const eventTarget = new EventTarget();

  const push = <Event extends keyof Events>(event: Event, data: Events[Event]) =>
    eventTarget.dispatchEvent(new CustomEvent(event as string, { detail: data }));

  const subscribe = <Key extends keyof Events>(
    event: Key,
    listener: (data: Events[Key]) => void
  ) => {
    const callback = (event: Event) => listener((event as CustomEvent).detail);

    eventTarget.addEventListener(event as string, callback);
    return () => eventTarget.removeEventListener(event as string, callback);
  };

  const unsubscribe = <Key extends keyof Events>(
    event: Key,
    listener: (data: Events[Key]) => void
  ) => {
    const callback = (event: Event) => listener((event as CustomEvent).detail);
    eventTarget.removeEventListener(event as string, callback);
  };

  const useSubscribe = <Event extends keyof Events>(
    event: Event,
    listener?: (data: Events[Event]) => void
  ) => {
    const [data, setData] = useState<Events[Event] | undefined>(undefined);
    const listenerRef = useRef(listener);
    listenerRef.current = listener;

    useEffect(() => {
      const onSubscribe = (data: Events[Event]) => {
        setData(data);
        listenerRef.current?.(data);
      };
      subscribe(event, onSubscribe);
      return () => {
        unsubscribe(event, onSubscribe);
      };
    }, [event]);

    return data;
  };

  return {
    instance: eventTarget,
    push,
    subscribe,
    unsubscribe,
    useSubscribe
  };
};
