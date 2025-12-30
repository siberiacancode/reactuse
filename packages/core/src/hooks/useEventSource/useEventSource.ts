import { useEffect, useRef, useState } from 'react';

import { getRetry } from '@/utils/helpers';

/** The use event source options type */
export interface UseEventSourceOptions<QueryData, Data> extends EventSourceInit {
  /** Immediately open the connection when calling this hook */
  immediately?: boolean;
  /* The placeholder data for the hook */
  placeholderData?: (() => Data) | Data;
  /* The retry count of requests */
  retry?: boolean | number;
  /* The retry delay of requests */
  retryDelay?: ((retry: number, event: Event) => number) | number;
  /* The onError function to be invoked */
  onError?: (error: Event) => void;
  /* The onMessage function to be invoked */
  onMessage?: (event: Event & { data?: Data }) => void;
  /* The onOpen function to be invoked */
  onOpen?: () => void;
  /* The select function to be invoked */
  select?: (data: QueryData) => Data;
}

/** The use event source return type */
interface UseEventSourceReturn<Data = any> {
  /** The latest data received via the EventSource */
  data?: Data;
  /** The current error */
  error?: Event;
  /** The instance of the EventSource */
  instance?: EventSource;
  /* The connecting state of the query */
  isConnecting: boolean;
  /* The error state of the query */
  isError: boolean;
  /* The open state of the query */
  opened: boolean;
  /** Closes the EventSource connection gracefully */
  close: () => void;
  /** Reopen the EventSource connection */
  open: () => void;
}

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
export const useEventSource = <QueryData = any, Data = QueryData>(
  url: string | URL,
  events: string[] = [],
  options: UseEventSourceOptions<QueryData, Data> = {}
): UseEventSourceReturn<Data> => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [opened, setOpened] = useState(false);
  const [isError, setIsError] = useState(false);

  const retryCountRef = useRef(options?.retry ? getRetry(options.retry) : 0);
  const [error, setError] = useState<Event | undefined>(undefined);
  const [data, setData] = useState<Data | undefined>(options?.placeholderData);

  const eventSourceRef = useRef<EventSource>(undefined);

  const immediately = options.immediately ?? true;

  const onEventRef = useRef((event: Event & { data?: Data }) => setData(event.data));

  const close = () => {
    if (!eventSourceRef.current) return;

    setOpened(false);
    setIsConnecting(false);
    setIsError(false);

    events.forEach((eventName) =>
      eventSourceRef.current!.removeEventListener(eventName, onEventRef.current)
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
