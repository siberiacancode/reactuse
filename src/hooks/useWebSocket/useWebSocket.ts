import { useEffect, useRef, useState } from 'react';

const connectSocket = (url: string) => {
  return new WebSocket(url);
};

interface IOptions {
  onFail: () => void;
  onSuccess: () => void;
  reconnectTimeout?: number;
}

type IStatus = 'connecting' | 'failed' | 'connected' | 'disconnected';

/**
 * Custom React hook to connect to a WebSocket server.
 *
 * @function useWebSocket
 * @param {string} url - The WebSocket server URL to connect to.
 * @param {function} onMessage - Callback function to handle incoming WebSocket messages.
 * @param {IOptions} [options] - Optional configuration object.
 * @param {function} options.onFail - Callback function to execute when the WebSocket connection fails.
 * @param {function} options.onSuccess - Callback function to execute when the WebSocket connection is successfully established.
 * @param {number} [options.reconnectTimeout=5000] - The time interval in milliseconds to wait before attempting to reconnect after the connection is closed.
 * @returns {object} - An object containing the WebSocket client instance, a boolean indicating if the connection is open, and a function to send data through the WebSocket.
 * @returns {WebSocket|null} return.client - The WebSocket client instance or null if not connected.
 * @returns {boolean} return.open - A boolean indicating if the WebSocket connection is open.
 * @returns {function} return.send - A function to send data through the WebSocket.
 * @returns {status} return.status - A status string, which tells the user status of connection
 * @example
 *
 * const { client, open, send } = useWebSocket('wss://serverws.com/', (message) => {
 *   console.log(message.data);
 * }, {
 *   onFail: () => console.log('Connection failed'),
 *   onSuccess: () => console.log('Connection successful'),
 *   reconnectTimeout: 10000
 * });
 *
 * const sendMessage = (data) => {
 *    send(data)
 * }
 */
export const useWebSocket = (
  url: string,
  onMessage: (message: MessageEvent) => void,
  options?: IOptions
) => {
  const ws = useRef<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [waitingToReconnect, setWaitingToReconnect] = useState<any>(null);
  const [status, setStatus] = useState<IStatus>('connecting');

  const send = (data: Record<string, any>) => {
    ws.current?.send(JSON.stringify(data));
  };

  useEffect(() => {
    if (waitingToReconnect) return;

    const setupWebSocket = () => {
      const client = connectSocket(url);
      ws.current = client;

      client.onerror = (e) => {
        if (options?.onFail) {
          options?.onFail();
        }
        setStatus('failed');
        console.error('WebSocket error:', e);
      };

      client.onopen = () => {
        setIsOpen(true);
        setStatus('connected');
        if (options?.onSuccess) {
          options?.onSuccess();
        }
      };

      client.onmessage = (message) => {
        onMessage(message);
      };

      client.onclose = () => {
        if (waitingToReconnect) return;

        setIsOpen(false);
        setStatus('disconnected');
        setWaitingToReconnect(true);

        setTimeout(() => {
          setWaitingToReconnect(null);
        }, options?.reconnectTimeout || 5000);
      };
    };

    setupWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [url, waitingToReconnect]);

  return { client: ws.current, open: isOpen, send, status };
};
