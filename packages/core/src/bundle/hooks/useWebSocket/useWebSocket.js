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
  const [status, setStatus] = useState(immediately ? 'connecting' : 'disconnected');
  const send = (data) => {
    webSocketRef.current?.send(data);
  };
  const close = () => {
    explicityCloseRef.current = true;
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
    };
    webSocket.onerror = (event) => {
      setStatus('failed');
      options?.onError?.(event, webSocket);
    };
    webSocket.onmessage = (event) => options?.onMessage?.(event, webSocket);
    webSocket.onclose = (event) => {
      setStatus('disconnected');
      options?.onClose?.(event, webSocket);
      if (explicityCloseRef.current) return;
      const shouldRetry =
        typeof options?.retry === 'function'
          ? options.retry(failureCountRef.current, event)
          : failureCountRef.current < getRetry(options?.retry ?? 0);
      if (shouldRetry) {
        failureCountRef.current += 1;
        return init();
      }
      failureCountRef.current = 0;
    };
  };
  const open = () => {
    explicityCloseRef.current = false;
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
      if (!webSocketRef.current) return;
      webSocketRef.current.onclose = null;
      webSocketRef.current.close();
      webSocketRef.current = undefined;
    };
  }, [url]);
  return { client: webSocketRef.current, close, open, send, status };
};
