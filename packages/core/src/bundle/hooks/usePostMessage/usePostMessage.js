import { useEffect, useRef } from 'react';
/**
 * @name usePostMessage
 * @description - Hook that allows you to receive messages from other origins
 * @category Browser
 * @usage low
 *
 * @overload
 * @template Message The message data type
 * @param {UsePostMessageOrigin} origin The origin of the message
 * @param {(message: Message) => Message} callback callback to get received message
 * @returns {(message: Message) => void} An object containing the current message
 *
 * @example
 * const postMessage = usePostMessage();
 */
export const usePostMessage = (origin, callback) => {
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalOriginRef = useRef(origin);
  internalOriginRef.current = origin;
  useEffect(() => {
    const onMessage = (event) => {
      if (Array.isArray(internalOriginRef.current)) {
        if (!internalOriginRef.current.includes(event.origin)) return;
      } else if (internalOriginRef.current !== '*' && event.origin !== internalOriginRef.current)
        return;
      internalCallbackRef.current(event.data, event);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  const postMessage = (message) => {
    if (Array.isArray(internalOriginRef.current))
      return internalOriginRef.current.forEach((origin) => window.postMessage(message, origin));
    window.postMessage(message, internalOriginRef.current);
  };
  return postMessage;
};
