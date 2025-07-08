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
export const createEventEmitter = () => {
  const eventTarget = new EventTarget();
  const push = (event, data) => eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }));
  const subscribe = (event, listener) => {
    const callback = (event) => listener(event.detail);
    eventTarget.addEventListener(event, callback);
    return () => eventTarget.removeEventListener(event, callback);
  };
  const unsubscribe = (event, listener) => {
    const callback = (event) => listener(event.detail);
    eventTarget.removeEventListener(event, callback);
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
