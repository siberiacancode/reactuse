import type {
  UseEventListenerOptions,
  UseEventListenerTarget
} from '../useEventListener/useEventListener';
import { useEventListener } from '../useEventListener/useEventListener';

export type UseKeyPressEventKey = string | string[];

export interface UseKeyPressEvent {
  (
    key: UseKeyPressEventKey,
    target: Window,
    listener: (this: Window, event: WindowEventMap['keydown']) => void,
    options?: UseEventListenerOptions
  ): void;

  (
    key: UseKeyPressEventKey,
    target: Document,
    listener: (this: Document, event: DocumentEventMap['keydown']) => void,
    options?: UseEventListenerOptions
  ): void;

  <Target extends UseEventListenerTarget>(
    key: UseKeyPressEventKey,
    target: Target,
    listener: (this: Target, event: HTMLElementEventMap['keydown']) => void,
    options?: UseEventListenerOptions
  ): void;

  <Target extends Element>(
    key: UseKeyPressEventKey,
    listener: (this: Target, event: HTMLElementEventMap['keydown']) => void,
    options?: UseEventListenerOptions,
    target?: never
  ): void;
}

export const useKeyPressEvent = ((...params: any[]) => {
  const keys = (Array.isArray(params[0]) ? params[0] : [params[0]]) as UseKeyPressEventKey;
  const target = (params[1] instanceof Function ? null : params[1]) as
    | UseEventListenerTarget
    | undefined;
  const callback = (target ? params[2] : params[1]) as (...arg: any[]) => void;
  const options: UseEventListenerOptions | undefined = target ? params[3] : params[2];

  const onKeyDown = (event: KeyboardEvent) => {
    if (keys.includes(event.key)) callback(event);
  };

  useEventListener(target ?? window, 'keydown', onKeyDown, options);
}) as UseKeyPressEvent;
