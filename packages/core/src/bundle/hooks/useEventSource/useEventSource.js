import { useCallback, useEffect, useRef, useState } from 'react';
function resolveNestedOptions(options) {
  if (options === true) return {};
  return options;
}
/**
 * Reactive wrapper for EventSource in React
 *
 * @param url The URL of the EventSource
 * @param events List of events to listen to
 * @param options Configuration options
 */
export function useEventSource(url, events = [], options = {}) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('CONNECTING');
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [lastEventId, setLastEventId] = useState(null);
  const eventSourceRef = useRef(null);
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
    es.onmessage = (e) => {
      setEvent(null);
      setData(e.data);
      setLastEventId(e.lastEventId);
    };
    events.forEach((eventName) => {
      es.addEventListener(eventName, (e) => {
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
