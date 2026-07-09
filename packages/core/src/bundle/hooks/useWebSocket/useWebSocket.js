import { useEffect, useRef, useState } from 'react';
import { getRetry } from '@/utils/helpers';
/**
 * @name useWebSocket
 * @description - Hook that connects to a WebSocket server and handles incoming and outgoing messages
 * @category Browser
 * @usage medium
 *
 * @browserapi WebSocket https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 *
 * @param {UseWebSocketUrl} url The URL of the WebSocket server
 * @param {(webSocket: WebSocket) => void} [options.onConnected] The callback function that is called when the WebSocket connection is established
 * @param {(event: CloseEvent, webSocket: WebSocket) => void} [options.onClose] The callback function that is called when the WebSocket connection is closed
 * @param {(event: Event, webSocket: WebSocket) => void} [options.onError] The callback function that is called when an error occurs
 * @param {(event: MessageEvent, webSocket: WebSocket) => void} [options.onMessage] The callback function that is called when a message is received
 * @param {boolean} [options.immediately=true] Immediately open the connection when calling this hook
 * @param {boolean | number | ((failureCount: number, event: CloseEvent) => boolean)} [options.retry] The number of times to retry the connection, or a function to decide whether to retry
 * @param {number} [options.retryDelay=0] The delay in milliseconds before retrying the connection
 * @param {((webSocket: WebSocket) => void)} [options.heartbeat] The heartbeat callback that is called on each tick
 * @param {number} [options.heartbeatDelay=30000] The heartbeat interval in milliseconds
 * @param {Array<'soap' | 'wasm'>} [options.protocols] The list of protocols to use
 * @returns {UseWebSocketReturn} An object with the status, close, send, open, and client properties
 *
 * @example
 * const { status, close, send, open, client } = useWebSocket('url');
 */
export const useWebSocket = (url, options) => {
  const immediately = options?.immediately ?? true;
  const webSocketRef = useRef(undefined);
  const failureCountRef = useRef(0);
  const explicityCloseRef = useRef(false);
  const retryTimeoutRef = useRef(undefined);
  const heartbeatIntervalRef = useRef(undefined);
  const [status, setStatus] = useState(immediately ? 'connecting' : 'closed');
  const send = (data) => {
    webSocketRef.current?.send(data);
  };
  const close = () => {
    explicityCloseRef.current = true;
    clearTimeout(retryTimeoutRef.current);
    clearInterval(heartbeatIntervalRef.current);
    webSocketRef.current?.close();
    webSocketRef.current = undefined;
  };
  const init = () => {
    webSocketRef.current = new WebSocket(
      typeof url === 'function' ? url() : url,
      options?.protocols
    );
    setStatus('connecting');
    const webSocket = webSocketRef.current;
    if (!webSocket) return;
    webSocket.onopen = () => {
      failureCountRef.current = 0;
      setStatus('connected');
      options?.onConnected?.(webSocket);
      if (!options?.heartbeat) return;
      const { heartbeat } = options;
      heartbeatIntervalRef.current = setInterval(() => {
        if (webSocket.readyState !== WebSocket.OPEN)
          return clearInterval(heartbeatIntervalRef.current);
        heartbeat(webSocket);
      }, options.heartbeatDelay ?? 30000);
    };
    webSocket.onerror = (event) => {
      setStatus('failed');
      options?.onError?.(event, webSocket);
    };
    webSocket.onmessage = (event) => options?.onMessage?.(event, webSocket);
    webSocket.onclose = (event) => {
      clearInterval(heartbeatIntervalRef.current);
      setStatus('closed');
      options?.onClose?.(event, webSocket);
      if (explicityCloseRef.current) return;
      const shouldRetry =
        typeof options?.retry === 'function'
          ? options.retry(failureCountRef.current, event)
          : failureCountRef.current < getRetry(options?.retry ?? 0);
      if (shouldRetry) {
        failureCountRef.current += 1;
        const delay = options?.retryDelay ?? 0;
        if (!delay) return init();
        retryTimeoutRef.current = setTimeout(init, delay);
        return;
      }
      failureCountRef.current = 0;
    };
  };
  const open = () => {
    explicityCloseRef.current = false;
    clearTimeout(retryTimeoutRef.current);
    clearInterval(heartbeatIntervalRef.current);
    if (webSocketRef.current) {
      webSocketRef.current.onclose = null;
      webSocketRef.current.close();
      webSocketRef.current = undefined;
    }
    init();
  };
  useEffect(() => {
    if (immediately) init();
    return () => {
      clearTimeout(retryTimeoutRef.current);
      clearInterval(heartbeatIntervalRef.current);
      if (!webSocketRef.current) return;
      webSocketRef.current.onclose = null;
      webSocketRef.current.close();
      webSocketRef.current = undefined;
    };
  }, [url]);
  return { client: webSocketRef.current, close, open, send, status };
};
