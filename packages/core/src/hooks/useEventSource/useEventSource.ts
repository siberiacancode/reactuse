import { useCallback, useEffect, useRef, useState } from 'react';

type EventSourceStatus = 'CLOSED' | 'CONNECTING' | 'OPEN';

interface UseEventSourceOptions extends EventSourceInit {
  /**
   * Automatically connect to the EventSource when URL changes
   *
   * @default true
   */
  autoConnect?: boolean;

  /**
   * Immediately open the connection when calling this hook
   *
   * @default true
   */
  immediate?: boolean;

  /**
   * Enabled auto reconnect
   *
   * @default false
   */
  autoReconnect?:
    | boolean
    | {
        /**
         * Maximum retry times.
         *
         * Or you can pass a predicate function (which returns true if you want to retry).
         *
         * @default -1
         */
        retries?: (() => boolean) | number;

        /**
         * Delay for reconnect, in milliseconds
         *
         * @default 1000
         */
        delay?: number;

        /**
         * On maximum retry times reached.
         */
        onFailed?: () => void;
      };
}

interface UseEventSourceReturn<Data = any> {
  /**
   * The latest data received via the EventSource
   */
  data: Data | null;

  /**
   * The current error
   */
  error: Event | null;

  /**
   * The latest named event
   */
  event: string | null;

  /**
   * The last event ID string, for server-sent events
   */
  lastEventId: string | null;

  /**
   * The current state of the connection
   */
  status: EventSourceStatus;

  /**
   * Closes the EventSource connection gracefully
   */
  close: () => void;

  /**
   * Reopen the EventSource connection
   */
  open: () => void;
}

function resolveNestedOptions<T>(options: true | T): T {
  if (options === true) return {} as T;
  return options;
}

/**
 * Reactive wrapper for EventSource in React
 *
 * @param url The URL of the EventSource
 * @param events List of events to listen to
 * @param options Configuration options
 */
export function useEventSource<Data = any>(
  url: string | URL | undefined,
  events: string[] = [],
  options: UseEventSourceOptions = {}
): UseEventSourceReturn<Data> {
  const [data, setData] = useState<Data | null>(null);
  const [status, setStatus] = useState<EventSourceStatus>('CONNECTING');
  const [event, setEvent] = useState<string | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const [lastEventId, setLastEventId] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const explicitlyClosedRef = useRef(false);
  const retriedRef = useRef(0);

  const { withCredentials = false, immediate = true, autoConnect = true, autoReconnect } = options;

  const close = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setStatus('CLOSED');
      explicitlyClosedRef.current = true;
    }
  }, []);

  const open = useCallback(() => {
    if (!url) return;

    close();
    explicitlyClosedRef.current = false;
    retriedRef.current = 0;

    const es = new EventSource(url, { withCredentials });
    eventSourceRef.current = es;

    setStatus('CONNECTING');

    es.onopen = () => {
      setStatus('OPEN');
      setError(null);
    };

    es.onerror = (e) => {
      setStatus('CLOSED');
      setError(e);

      // Reconnect logic
      if (es.readyState === 2 && !explicitlyClosedRef.current && autoReconnect) {
        es.close();
        const { retries = -1, delay = 1000, onFailed } = resolveNestedOptions(autoReconnect);
        retriedRef.current += 1;

        if (typeof retries === 'number' && (retries < 0 || retriedRef.current < retries)) {
          setTimeout(open, delay);
        } else if (typeof retries === 'function' && retries()) {
          setTimeout(open, delay);
        } else {
          onFailed?.();
        }
      }
    };

    es.onmessage = (e: MessageEvent) => {
      setEvent(null);
      setData(e.data);
      setLastEventId(e.lastEventId);
    };

    events.forEach((eventName) => {
      es.addEventListener(eventName, (e: Event & { data?: Data }) => {
        setEvent(eventName);
        setData(e.data || null);
      });
    });
  }, [url, withCredentials, autoReconnect, events, close]);

  useEffect(() => {
    if (immediate) open();
    return () => close();
  }, [immediate, open, close]);

  useEffect(() => {
    if (autoConnect) open();
  }, [url, autoConnect, open]);

  return {
    data,
    status,
    event,
    error,
    close,
    open,
    lastEventId
  };
}
