import { useEffect, useRef, useState } from 'react';

export interface EventEmitterApi<Events extends Record<string, any>> {
  /** Subscribes a listener that runs once and then unsubscribes itself */
  once: <Event extends keyof Events>(
    event: Event,
    listener: (data: Events[Event]) => void
  ) => () => void;
  /** Notifies every listener of the event, in subscription order. Listeners are dispatched over a snapshot, so subscribing inside a listener does not deliver the event being dispatched, while unsubscribing inside one still delivers it. A listener that throws does not stop the rest, its error is rethrown asynchronously through queueMicrotask so it reaches the global error handler. */
  push: <Event extends keyof Events>(event: Event, data: Events[Event]) => void;
  /** Removes every listener of the event, or of all events when called without arguments */
  reset: <Event extends keyof Events>(event?: Event) => void;
  /** Subscribes a listener and returns a function that unsubscribes it */
  subscribe: <Event extends keyof Events>(
    event: Event,
    listener: (data: Events[Event]) => void
  ) => () => void;
  /** Removes a listener registered with subscribe or once */
  unsubscribe: <Event extends keyof Events>(
    event: Event,
    listener: (data: Events[Event]) => void
  ) => void;
  /** Hook that returns the last received data and rerenders the component on every push */
  useSubscribe: <Event extends keyof Events>(
    event: Event,
    listener?: (data: Events[Event]) => void
  ) => Events[Event] | undefined;
  /** Hook that runs a listener on every push without rerendering the component */
  useSubscribeEffect: <Event extends keyof Events>(
    event: Event,
    listener: (data: Events[Event]) => void
  ) => void;
}

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
export const createEventEmitter = <
  Events extends Record<string, any> = Record<string, any>
>(): EventEmitterApi<Events> => {
  type Listener = ((data: any) => void) & { listener?: (data: any) => void };
  type ListenerMap = Map<keyof Events, Set<Listener>>;
  const listeners: ListenerMap = new Map();

  const push = <Event extends keyof Events>(event: Event, data: Events[Event]) => {
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

  const unsubscribe = <Event extends keyof Events>(
    event: Event,
    listener: (data: Events[Event]) => void
  ) => {
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

  const subscribe = <Event extends keyof Events>(
    event: Event,
    listener: (data: Events[Event]) => void
  ) => {
    if (!listeners.has(event)) listeners.set(event, new Set());
    const eventListeners = listeners.get(event)!;
    eventListeners.add(listener);

    return () => {
      unsubscribe(event, listener);
    };
  };

  const once = <Event extends keyof Events>(
    event: Event,
    listener: (data: Events[Event]) => void
  ) => {
    const wrapper: Listener = (data) => {
      unsubscribe(event, wrapper);
      listener(data);
    };
    wrapper.listener = listener;

    return subscribe(event, wrapper);
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

  const useSubscribeEffect = <Event extends keyof Events>(
    event: Event,
    listener: (data: Events[Event]) => void
  ) => {
    const listenerRef = useRef(listener);
    listenerRef.current = listener;

    useEffect(() => {
      const onSubscribe = (data: Events[Event]) => {
        listenerRef.current?.(data);
      };

      const unsubscribe = subscribe(event, onSubscribe);
      return () => {
        unsubscribe();
      };
    }, [event]);
  };

  const reset = <Event extends keyof Events>(event?: Event) => {
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
