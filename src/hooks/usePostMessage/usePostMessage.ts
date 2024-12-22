import { useEffect, useRef } from 'react';

export type UsePostMessageReturn<Message> = (message: Message) => void;

/**
 * @name usePostMessage
 * @description - Hook that allows you to receive messages from other origins
 * @category Browser
 *
 * @overload
 * @template Message The message data type
 * @param {string | string[]} origin The origin of the message
 * @param {(message: Message) => Message} callback callback to get received message
 * @returns {(message: Message) => void} An object containing the current message
 *
 * @example
 * const postMessage = usePostMessage();
 */
export const usePostMessage = <Message>(
  origin: string | '*' | string[],
  callback: (message: Message, event: MessageEvent<Message>) => void
): UsePostMessageReturn<Message> => {
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    const onMessage = (event: MessageEvent<Message>) => {
      if (
        (Array.isArray(origin) && (!origin.includes(event.origin) || !origin.includes('*'))) ||
        (event.origin !== origin && origin !== '*')
      )
        return;

      internalCallbackRef.current(event.data as Message, event);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const postMessage = (message: Message) => {
    if (Array.isArray(origin)) {
      origin.forEach((origin) => window.postMessage(message, origin));
      return;
    }

    window.postMessage(message, origin);
  };

  return postMessage;
};
