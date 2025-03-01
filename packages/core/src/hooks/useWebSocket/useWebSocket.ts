import { useEffect, useRef, useState } from 'react';

import { getRetry } from '@/utils/helpers';

import { useEvent } from '../useEvent/useEvent';

export type UseWebSocketUrl = (() => string) | string;

export interface UseWebSocketOptions {
  protocols?: Array<'soap' | 'wasm'>;
  retry?: boolean | number;
  onConnected?: (webSocket: WebSocket) => void;
  onDisconnected?: (event: CloseEvent, webSocket: WebSocket) => void;
  onError?: (event: Event, webSocket: WebSocket) => void;
  onMessage?: (event: MessageEvent, webSocket: WebSocket) => void;
}

export type UseWebSocketStatus = 'connected' | 'connecting' | 'disconnected' | 'failed';

export interface UseWebSocketReturn {
  client?: WebSocket;
  close: WebSocket['close'];
  send: WebSocket['send'];
  status: UseWebSocketStatus;
  open: () => void;
}

/**
 * @name useWebSocket
 * @description - Hook that connects to a WebSocket server and handles incoming and outgoing messages
 * @category Browser
 *
 * @param {UseWebSocketUrl} url The URL of the WebSocket server
 * @param {(webSocket: WebSocket) => void} [options.onConnected] The callback function that is called when the WebSocket connection is established
 * @param {(event: CloseEvent, webSocket: WebSocket) => void} [options.onDisconnected] The callback function that is called when the WebSocket connection is closed
 * @param {(event: Event, webSocket: WebSocket) => void} [options.onError] The callback function that is called when an error occurs
 * @param {(event: MessageEvent, webSocket: WebSocket) => void} [options.onMessage] The callback function that is called when a message is received
 * @param {boolean | number} [options.retry] The number of times to retry the connection
 * @param {Array<'soap' | 'wasm'>} [options.protocols] The list of protocols to use
 * @returns {UseWebSocketReturn} An object with the status, close, send, open, and ws properties
 *
 * @example
 * const { status, close, send, open, client } = useWebSocket('url');
 */
export const useWebSocket = (
  url: UseWebSocketUrl,
  options?: UseWebSocketOptions
): UseWebSocketReturn => {
  const webSocketRef = useRef<WebSocket>();
  const retryCountRef = useRef(options?.retry ? getRetry(options.retry) : 0);
  const explicityCloseRef = useRef(false);

  const [status, setStatus] = useState<UseWebSocketStatus>('connecting');

  const send = (data: string | ArrayBufferLike | ArrayBufferView | Blob) =>
    webSocketRef.current?.send(data);

  const close = () => {
    explicityCloseRef.current = true;
    webSocketRef.current?.close();
  };

  const init = useEvent(() => {
    webSocketRef.current = new WebSocket(
      typeof url === 'function' ? url() : url,
      options?.protocols
    );
    setStatus('connecting');

    const webSocket = webSocketRef.current;
    if (!webSocket) return;

    webSocket.onopen = () => {
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
      options?.onDisconnected?.(event, webSocket);
      if (explicityCloseRef.current) return;

      if (retryCountRef.current > 0) {
        retryCountRef.current -= 1;
        return init();
      }
      retryCountRef.current = options?.retry ? getRetry(options.retry) : 0;
    };
  });

  useEffect(() => {
    init();

    return () => {
      if (!webSocketRef.current) return;
      webSocketRef.current.close();
      webSocketRef.current = undefined;
    };
  }, [url]);

  const open = () => {
    explicityCloseRef.current = false;
    init();
  };

  return { client: webSocketRef.current, close, open, send, status };
};
