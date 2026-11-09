import { useEffect, useRef, useState } from 'react';
/**
 * @name createEventEmitter
 * @description - Creates a type-safe event emitter
 * @category Helpers
 * @usage low
 *
 * @template Events - The type of events and their data
 * @returns {EventEmitterApi<Events>} - Object containing event emitter methods and hooks
 *
 * @example
 * const { push, subscribe, unsubscribe, once, reset, useSubscribe, useSubscribeEffect } =
 *   createEventEmitter<{ 'user:login': { id: string } }>();
 *
 * const unsubscribe = subscribe('user:login', (user) => console.log(user.id));
 * push('user:login', { id: '1' });
 *
 * @warning - A listener that throws does not stop the rest, its error is rethrown asynchronously, so a try/catch around push will not catch it. Calling reset without an event also removes the subscriptions of mounted components, and they do not resubscribe on their own, so prefer resetting a specific event.
 */
export const createEventEmitter = () => {
  const listeners = new Map();
  const push = (event, data) => {
    const eventListeners = listeners.get(event);
    if (!eventListeners) return;
    const eventListenersSnapshot = [...eventListeners];
    for (const listener of eventListenersSnapshot) {
      try {
        listener(data);
      } catch (error) {
        queueMicrotask(() => {
          throw error;
        });
      }
    }
  };
  const unsubscribe = (event, listener) => {
    const eventListeners = listeners.get(event);
    if (!eventListeners) return;
    if (!eventListeners.delete(listener)) {
      for (const candidate of eventListeners) {
        if (candidate.listener === listener) {
          eventListeners.delete(candidate);
          break;
        }
      }
    }
    if (!eventListeners.size) listeners.delete(event);
  };
  const subscribe = (event, listener) => {
    if (!listeners.has(event)) listeners.set(event, new Set());
    const eventListeners = listeners.get(event);
    eventListeners.add(listener);
    return () => {
      unsubscribe(event, listener);
    };
  };
  const once = (event, listener) => {
    const wrapper = (data) => {
      unsubscribe(event, wrapper);
      listener(data);
    };
    wrapper.listener = listener;
    return subscribe(event, wrapper);
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
  const useSubscribeEffect = (event, listener) => {
    const listenerRef = useRef(listener);
    listenerRef.current = listener;
    useEffect(() => {
      const onSubscribe = (data) => {
        listenerRef.current?.(data);
      };
      const unsubscribe = subscribe(event, onSubscribe);
      return () => {
        unsubscribe();
      };
    }, [event]);
  };
  const reset = (event) => {
    if (event !== undefined) {
      listeners.delete(event);
    } else {
      listeners.clear();
    }
  };
  return {
    push,
    subscribe,
    unsubscribe,
    useSubscribe,
    reset,
    useSubscribeEffect,
    once
  };
};
