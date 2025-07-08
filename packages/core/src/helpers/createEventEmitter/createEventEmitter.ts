import { useEffect, useRef, useState } from 'react';

/**
 * @name createEventEmitter
 * @description - Creates a type-safe event emitter
 * @category Helpers
 *
 * @template Events - The type of events and their data
 * @returns {EventEmitterApi<Events>} - Object containing event emitter methods and hook
 *
 * @example
 * const { push, subscribe, unsubscribe, useSubscribe } = createEventEmitter<{ foo: number }>();
 */
export const createEventEmitter = <Events extends Record<string, any> = Record<string, any>>() => {
  type ListenerMap = Map<string, Set<(data: any) => void>>;
  const listeners: ListenerMap = new Map();

  const push = <Event extends keyof Events>(event: Event, data: Events[Event]) => {
    const eventListeners = listeners.get(event as string);
    eventListeners?.forEach((listener) => listener(data));
  };

  const unsubscribe = <Key extends keyof Events>(
    event: Key,
    listener: (data: Events[Key]) => void
  ) => {
    const eventKey = event as string;
    const eventListeners = listeners.get(eventKey);
    if (!eventListeners) return;
    eventListeners.delete(listener);
    if (!eventListeners.size) listeners.delete(eventKey);
  };

  const subscribe = <Key extends keyof Events>(
    event: Key,
    listener: (data: Events[Key]) => void
  ) => {
    const eventKey = event as string;
    if (!listeners.has(eventKey)) listeners.set(eventKey, new Set());
    const eventListeners = listeners.get(event as string)!;
    eventListeners.add(listener);

    return () => {
      unsubscribe(event, listener);
    };
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

      const unsubscribe = subscribe(event, onSubscribe);
      return () => {
        unsubscribe();
      };
    }, [event]);

    return data;
  };

  return {
    push,
    subscribe,
    unsubscribe,
    useSubscribe
  };
};
