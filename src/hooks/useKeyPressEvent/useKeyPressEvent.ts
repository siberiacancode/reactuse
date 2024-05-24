import type {
  UseEventListenerOptions,
  UseEventListenerTarget
} from '../useEventListener/useEventListener';
import { useEventListener } from '../useEventListener/useEventListener';

export type UseKeyPressEvent = {
  (
    key: string,
    target: Window,
    listener: (this: Window, event: WindowEventMap['keydown']) => void,
    options?: UseEventListenerOptions
  ): void;

  (
    key: string,
    target: Document,
    listener: (this: Document, event: DocumentEventMap['keydown']) => void,
    options?: UseEventListenerOptions
  ): void;

  <Target extends UseEventListenerTarget>(
    key: string,
    target: Target,
    listener: (this: Target, event: HTMLElementEventMap['keydown']) => void,
    options?: UseEventListenerOptions
  ): void;

  <Target extends Element>(
    key: string,
    listener: (this: Target, event: HTMLElementEventMap['keydown']) => void,
    options?: UseEventListenerOptions,
    target?: never
  ): void;
};

export const useKeyPressEvent = ((...params: any[]) => {
  const key = params[0] as string;
  const target = (params[1] instanceof Function ? null : params[1]) as
    | UseEventListenerTarget
    | undefined;
  const callback = (target ? params[2] : params[1]) as (...arg: any[]) => void;
  const options: UseEventListenerOptions | undefined = target ? params[3] : params[2];

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === key) callback(event);
  };

  useEventListener(target ?? window, 'keydown', onKeyDown, options);
}) as UseKeyPressEvent;
