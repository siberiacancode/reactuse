import { useEffect } from 'react';

/** The possible entity types */
type PossibleEntity = Window | Worker | MessagePort;

/** The use post message entity arguments */
type PostMessageEntityArguments<Entity extends PossibleEntity> = Entity['postMessage'] extends (
  message: unknown,
  ...rest: infer Rest
) => void
  ? Rest
  : never;

/** The use post message return type */
export interface UsePostMessageReturn<MessagePayload> {
  postMessage: <Entity extends PossibleEntity>(
    targetSource: Entity,
    message: MessagePayload,
    ...args: PostMessageEntityArguments<Entity>
  ) => void;
}

/**
 * @name usePostMessage
 * @description - Hook that allows you to use `postMessage` function
 * @category Browser
 *
 * @overload
 * @template MessagePayload The message data type
 * @param {(message: MessageEvent<MessagePayload>) => void} onMessage callback to get received message event
 * @returns {UsePostMessageReturn} An object with a patched `postMethod` function
 *
 * @example
 * const { postMessage } = usePostMessage();
 */
export const usePostMessage = <MessagePayload = unknown>(
  onMessage?: (message: MessageEvent<MessagePayload>) => void
): UsePostMessageReturn<MessagePayload> => {
  const postMessage = <Entity extends PossibleEntity>(
    targetSource: Entity,
    message: MessagePayload,
    ...args: unknown[]
  ) => {
    if (targetSource instanceof Window) {
      targetSource.postMessage(message, ...(args as PostMessageEntityArguments<Window>));
    } else if (targetSource instanceof Worker) {
      targetSource.postMessage(message, ...(args as PostMessageEntityArguments<Worker>));
    } else {
      targetSource.postMessage(message, ...(args as PostMessageEntityArguments<MessagePort>));
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      'message',
      (event: MessageEvent<MessagePayload>) => {
        onMessage?.(event);
      },
      { signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  }, [onMessage]);

  return {
    postMessage
  };
};
