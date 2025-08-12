import { useEffect, useRef, useState } from 'react';
/**
 * @name useBroadcastChannel
 * @description Hook that provides cross-tab/window communication
 * @category Browser
 * @usage low
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
export const useBroadcastChannel = (name, callback) => {
  const supported = typeof window !== 'undefined' && 'BroadcastChannel' in window;
  const [closed, setClosed] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const channelRef = useRef(undefined);
  useEffect(() => {
    if (!supported) return;
    channelRef.current = new BroadcastChannel(name);
    const onMessage = (event) => {
      setData(event.data);
      callback?.(event.data);
    };
    const onMessageError = (event) => setError(event);
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
  const post = (data) => {
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
