import { useEffect, useRef } from 'react';

/** The origin of the message */
export type UsePostMessageOrigin = string | '*' | string[];

/** The return type of the usePostMessage hook */
export type UsePostMessageReturn<Message> = (message: Message) => void;

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
export const usePostMessage = <Message>(
  origin: UsePostMessageOrigin,
  callback: (message: Message, event: MessageEvent<Message>) => void
): UsePostMessageReturn<Message> => {
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalOriginRef = useRef(origin);
  internalOriginRef.current = origin;

  useEffect(() => {
    const onMessage = (event: MessageEvent<Message>) => {
      if (Array.isArray(internalOriginRef.current)) {
        if (!internalOriginRef.current.includes(event.origin)) return;
      } else if (internalOriginRef.current !== '*' && event.origin !== internalOriginRef.current)
        return;

      internalCallbackRef.current(event.data as Message, event);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const postMessage = (message: Message) => {
    if (Array.isArray(internalOriginRef.current))
      return internalOriginRef.current.forEach((origin) => window.postMessage(message, origin));

    window.postMessage(message, internalOriginRef.current);
  };

  return postMessage;
};
