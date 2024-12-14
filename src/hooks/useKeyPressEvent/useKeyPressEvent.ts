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

/**
 * @name useKeyPressEvent
 * @description - Hook that listens for key press events on specified targets
 * @category Sensors
 *
 * @overload
 * @param {UseKeyPressEventKey} key The key or array of keys to listen for.
 * @param {Window} target The window object to attach the event listener to.
 * @param {(event: KeyboardEvent) => void} listener The callback function to be executed when the specified key or keys are pressed.
 * @param {UseEventListenerOptions} [options] The options for the event listener.
 * @returns {void}
 *
 * @example
 * useKeyPressEvent('Enter', window, () => console.log('Enter key pressed'));
 *
 * @overload
 * @param {UseKeyPressEventKey} key The key or array of keys to listen for.
 * @param {Document} target The document object to attach the event listener to.
 * @param {(event: KeyboardEvent) => void} listener The callback function to be executed when the specified key or keys are pressed.
 * @param {UseEventListenerOptions} [options] The options for the event listener.
 * @returns {void}
 *
 * @example
 * useKeyPressEvent('Enter', document, () => console.log('Enter key pressed'));
 *
 * @overload
 * @template Target The target element type.
 * @param {UseKeyPressEventKey} key The key or array of keys to listen for.
 * @param {Target} target The target element to attach the event listener to.
 * @param {(event: KeyboardEvent) => void} listener The callback function to be executed when the specified key or keys are pressed.
 * @param {UseEventListenerOptions} [options] The options for the event listener.
 * @returns {void}
 *
 * @example
 * useKeyPressEvent('Enter', ref, () => console.log('Enter key pressed'));
 *
 * @overload
 * @template Target extends Element
 * @param {UseKeyPressEventKey} key The key or array of keys to listen for.
 * @param {(event: KeyboardEvent) => void} listener The callback function to be executed when the specified key or keys are pressed.
 * @param {UseEventListenerOptions} [options] The options for the event listener.
 * @returns {void}
 *
 * @example
 * useKeyPressEvent('Enter', (event) => console.log('Enter key pressed'));
 */
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
