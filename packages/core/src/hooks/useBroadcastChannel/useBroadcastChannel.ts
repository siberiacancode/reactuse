import { useEffect, useRef, useState } from 'react';

/** The use broadcast channel return type */
export interface UseBroadcastChannelReturn<Data = unknown> {
  /** The underlying BroadcastChannel instance if supported, undefined otherwise */
  channel?: BroadcastChannel;
  /** Whether the channel has been closed */
  closed: boolean;
  /** The most recently received data from other contexts */
  data?: Data;
  /** Error object if any error occurred during channel operations */
  error?: Event;
  /** Whether the BroadcastChannel API is supported in the current environment */
  supported: boolean;
  /** Function to close the channel and clean up resources */
  close: () => void;
  /** Function to send data to other contexts through the channel */
  post: (data: Data) => void;
}

/**
 * @name useBroadcastChannel
 * @description Hook that provides cross-tab/window communication
 * @category Browser
 *
 * @browserapi BroadcastChannel https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
 *
 * @param {string} name The name of the channel
 * @param {Function} callback A callback function that will be called when a message is received
 * @returns {UseBroadcastChannelReturn} An object containing the channel state and controls
 *
 * @example
 * const { supported, data, post, error } = useBroadcastChannel('channel');
 */
export const useBroadcastChannel = <Data = unknown>(
  name: string,
  callback?: (data: Data) => void
): UseBroadcastChannelReturn<Data> => {
  const supported = typeof window !== 'undefined' && 'BroadcastChannel' in window;

  const [closed, setClosed] = useState(false);
  const [data, setData] = useState<Data>();
  const [error, setError] = useState<MessageEvent>();
  const channelRef = useRef<BroadcastChannel>(undefined);

  useEffect(() => {
    if (!supported) return;

    channelRef.current = new BroadcastChannel(name);

    const onMessage = (event: MessageEvent) => {
      setData(event.data);
      callback?.(event.data);
    };
    const onMessageError = (event: MessageEvent) => setError(event);
    const onClose = () => setClosed(true);

    channelRef.current.addEventListener('message', onMessage);
    channelRef.current.addEventListener('messageerror', onMessageError);
    channelRef.current.addEventListener('close', onClose);

    return () => {
      if (channelRef.current) {
        channelRef.current.removeEventListener('message', onMessage);
        channelRef.current.removeEventListener('messageerror', onMessageError);
        channelRef.current.removeEventListener('close', onClose);
        channelRef.current.close();
      }
    };
  }, [name]);

  const post = (data: Data) => {
    console.log('post', data, channelRef.current);
    if (!channelRef.current) return;
    channelRef.current.postMessage(data);
  };

  const close = () => {
    if (!channelRef.current) return;
    channelRef.current.close();
    setClosed(true);
  };

  return {
    supported,
    channel: channelRef.current,
    data,
    post,
    close,
    error,
    closed
  };
};
