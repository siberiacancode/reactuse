import { useEffect, useRef, useState } from 'react';
import { getRetry } from '@/utils/helpers';
/**
 * @name useEventSource
 * @description - Hook that provides a reactive wrapper for event source
 * @category Browser
 * @usage low
 *
 * @browserapi EventSource https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 *
 * @param {string | URL} url The URL of the EventSource
 * @param {string[]} [events=[]] List of events to listen to
 * @param {UseEventSourceOptions} [options={}] Configuration options
 * @returns {UseEventSourceReturn<Data>} The EventSource state and controls
 *
 * @example
 * const { instance, data, connecting, opened, isError, close, open } = useEventSource('url', ['message']);
 */
export const useEventSource = (url, events = [], options = {}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [opened, setOpened] = useState(false);
  const [isError, setIsError] = useState(false);
  const retryCountRef = useRef(options?.retry ? getRetry(options.retry) : 0);
  const [error, setError] = useState(undefined);
  const [data, setData] = useState(options?.placeholderData);
  const eventSourceRef = useRef(undefined);
  const immediately = options.immediately ?? true;
  const onEventRef = useRef((event) => setData(event.data));
  const close = () => {
    if (!eventSourceRef.current) return;
    setOpened(false);
    setIsConnecting(false);
    setIsError(false);
    events.forEach((eventName) =>
      eventSourceRef.current.removeEventListener(eventName, onEventRef.current)
    );
    eventSourceRef.current.close();
    eventSourceRef.current = undefined;
  };
  const open = () => {
    close();
    const eventSource = new EventSource(url, {
      withCredentials: options.withCredentials ?? false
    });
    eventSourceRef.current = eventSource;
    setIsConnecting(true);
    eventSource.onopen = () => {
      setOpened(true);
      setIsConnecting(false);
      setError(undefined);
      options?.onOpen?.();
    };
    eventSource.onerror = (event) => {
      setOpened(false);
      setIsConnecting(false);
      setIsError(true);
      setError(event);
      options?.onError?.(event);
      if (retryCountRef.current > 0) {
        retryCountRef.current -= 1;
        const retryDelay =
          typeof options?.retryDelay === 'function'
            ? options?.retryDelay(retryCountRef.current, event)
            : options?.retryDelay;
        if (retryDelay) {
          setTimeout(open, retryDelay);
          return;
        }
        return open();
      }
      retryCountRef.current = options?.retry ? getRetry(options.retry) : 0;
    };
    eventSource.onmessage = (event) => {
      const data = options?.select ? options?.select(event.data) : event.data;
      setData(data);
      options?.onMessage?.(event);
    };
    events.forEach((eventName) => eventSource.addEventListener(eventName, onEventRef.current));
  };
  useEffect(() => {
    if (!immediately) return;
    open();
    return () => {
      close();
    };
  }, [immediately]);
  return {
    instance: eventSourceRef.current,
    data,
    error,
    isConnecting,
    opened,
    isError,
    close,
    open
  };
};
