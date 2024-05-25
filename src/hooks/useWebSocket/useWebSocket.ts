import { useEffect, useRef, useState } from 'react';

const connectSocket = (url: string) => {
  return new WebSocket(url);
};

/**
 * @name useWebSocket
 * @description Hook connects to a websocket server and returns a event
 * @param {url} string
 * @param {onMessage} callback
 * @returns {Ref}
 * @example
 * useWebSocket('wss://serverws.com/', (message) => console.log(message));
 */
export const useWebSocket = (url: string, onMessage: (message: MessageEvent) => void) => {
  const ws = useRef<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [waitingToReconnect, setWaitingToReconnect] = useState<any>(null);

  useEffect(() => {
    if (waitingToReconnect) return;

    const setupWebSocket = () => {
      const client = connectSocket(url);
      ws.current = client;

      client.onerror = (e) => console.error('WebSocket error:', e);

      client.onopen = () => {
        setIsOpen(true);
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

  return { client: ws.current, isOpen };
};
