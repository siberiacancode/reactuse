import { useEffect, useRef, useState } from 'react';
import { getRetry } from '@/utils/helpers';
/**
 * @name useEventSource
 * @description - Hook that provides a reactive wrapper for event source
 * @category Browser
 *
 * @browserapi EventSource https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 *
 * @param {string | URL} url The URL of the EventSource
 * @param {string[]} [events=[]] List of events to listen to
 * @param {UseEventSourceOptions} [options={}] Configuration options
 * @returns {UseEventSourceReturn<Data>} The EventSource state and controls
 *
 * @example
 * const { instance, data, isConnecting, isOpen, isError, close, open } = useEventSource('url', ['message']);
 */
export const useEventSource = (url, events = [], options = {}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const retryCountRef = useRef(options?.retry ? getRetry(options.retry) : 0);
  const [error, setError] = useState(undefined);
  const [data, setData] = useState(options?.placeholderData);
  const eventSourceRef = useRef(undefined);
  const immediately = options.immediately ?? true;
  const close = () => {
    if (!eventSourceRef.current) return;
    eventSourceRef.current.close();
    eventSourceRef.current = undefined;
    setIsOpen(false);
    setIsConnecting(false);
    setIsError(false);
  };
  const open = () => {
    close();
    const eventSource = new EventSource(url, { withCredentials: options.withCredentials ?? false });
    eventSourceRef.current = eventSource;
    setIsConnecting(true);
    eventSource.onopen = () => {
      setIsOpen(true);
      setIsConnecting(false);
      setError(undefined);
      options?.onOpen?.();
    };
    eventSource.onerror = (event) => {
      setIsOpen(false);
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
      }
      retryCountRef.current = options?.retry ? getRetry(options.retry) : 0;
    };
    eventSource.onmessage = (event) => {
      const data = options?.select ? options?.select(event.data) : event.data;
      setData(data);
      options?.onMessage?.(event);
    };
    events.forEach((eventName) => {
      eventSource.addEventListener(eventName, (event) => {
        setData(event.data);
      });
    });
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
    isOpen,
    isError,
    close,
    open
  };
};
