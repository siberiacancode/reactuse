import { useEffect, useRef, useState } from 'react';

const connectSocket = (url: string) => {
  return new WebSocket(url);
};

interface IOptions {
  onFail: () => void;
  onSuccess: () => void;
}

/**
 * Custom React hook to connect to a WebSocket server.
 *
 * @function useWebSocket
 * @param {string} url - The WebSocket server URL to connect to.
 * @param {function} onMessage - Callback function to handle incoming WebSocket messages.
 * @param {IOptions} [options] - Optional configuration object.
 * @param {function} options.onFail - Callback function to execute when the WebSocket connection fails.
 * @param {function} options.onSuccess - Callback function to execute when the WebSocket connection is successfully established.
 * @returns {object} - An object containing the WebSocket client instance, a boolean indicating if the connection is open, and a function to send data through the WebSocket.
 * @returns {WebSocket|null} return.client - The WebSocket client instance or null if not connected.
 * @returns {boolean} return.open - A boolean indicating if the WebSocket connection is open.
 * @returns {function} return.send - A function to send data through the WebSocket.
 *
 * @example
 * const { client, open, send } = useWebSocket('wss://serverws.com/', (message) => {
 *   console.log(message.data);
 * }, {
 *   onFail: () => console.log('Connection failed'),
 *   onSuccess: () => console.log('Connection successful')
 * });
 */
export const useWebSocket = (
  url: string,
  onMessage: (message: MessageEvent) => void,
  options?: IOptions
) => {
  const ws = useRef<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [waitingToReconnect, setWaitingToReconnect] = useState<any>(null);

  const send = (data: string) => {
    ws.current?.send(data);
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
        console.error('WebSocket error:', e);
      };

      client.onopen = () => {
        setIsOpen(true);
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

        setWaitingToReconnect(true);

        setTimeout(() => {
          setWaitingToReconnect(null);
        }, 5000);
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

  return { client: ws.current, open: isOpen, send };
};
