import { useEffect, useRef, useState } from 'react';
/**
 * @name createEventEmitter
 * @description - Creates a type-safe event emitter
 * @category Helpers
 * @usage low
 *
 * @template Events - The type of events and their data
 * @returns {EventEmitterApi<Events>} - Object containing event emitter methods and hook
 *
 * @example
 * const { push, subscribe, unsubscribe, useSubscribe } = createEventEmitter<{ foo: number }>();
 */
export const createEventEmitter = () => {
  const listeners = new Map();
  const push = (event, data) => {
    const eventListeners = listeners.get(event);
    eventListeners?.forEach((listener) => listener(data));
  };
  const unsubscribe = (event, listener) => {
    const eventKey = event;
    const eventListeners = listeners.get(eventKey);
    if (!eventListeners) return;
    eventListeners.delete(listener);
    if (!eventListeners.size) listeners.delete(eventKey);
  };
  const subscribe = (event, listener) => {
    const eventKey = event;
    if (!listeners.has(eventKey)) listeners.set(eventKey, new Set());
    const eventListeners = listeners.get(event);
    eventListeners.add(listener);
    return () => {
      unsubscribe(event, listener);
    };
  };
  const useSubscribe = (event, listener) => {
    const [data, setData] = useState(undefined);
    const listenerRef = useRef(listener);
    listenerRef.current = listener;
    useEffect(() => {
      const onSubscribe = (data) => {
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
