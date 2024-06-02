import React from 'react';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';
import { useEvent } from '../useEvent/useEvent';
import type { UseEventListenerTarget } from '../useEventListener/useEventListener';
import { useEventListener } from '../useEventListener/useEventListener';

/** The use keys pressed params */
interface UseHotkeysOptions {
  /** The target to attach the event listeners to */
  target?: UseEventListenerTarget;

  /** Enable or disable the event listeners */
  enabled?: boolean;

  /** Whether to prevent the default behavior of the event */
  preventDefault?: boolean;

  /** Alias map for hotkeys */
  aliasMap?: Record<string, string>;
}

export const isHotkeyMatch = (hotkey: string, keys: UseHotkeysKey[]) =>
  hotkey
    .toLowerCase()
    .split(/[+_-]/g)
    .map((key) => key.trim())
    .every((key) =>
      keys.find(
        (updatedKey) =>
          key === updatedKey.code.toLocaleLowerCase() ||
          key === updatedKey.key.toLocaleLowerCase() ||
          key === updatedKey.alias.toLocaleLowerCase()
      )
    );

type UseHotkeysHotkeys = string[] | string;
type UseHotkeysKey = { key: string; code: string; alias: string };

/**
 * @name useHotkeys
 * @description - Hook that listens for key press events
 *
 * @param {UseHotkeysHotkeys} hotkeys The key or keys to listen for
 * @param {(event: KeyboardEvent) => void} callback The callback function to be called when the hotkey is pressed
 * @param {UseEventListenerTarget} [options.target=window] The target to attach the event listeners to
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @param {boolean} [options.preventDefault=true] Whether to prevent the default behavior of the event
 * @param {Record<string, string>} [options.aliasMap] Alias map for hotkeys
 * @returns {useKeysPressedReturns} Array of strings with keys that were press
 *
 * @example
 * useHotkeys('control+a', () => console.log('hotkey pressed'));
 *
 * @example
 * useHotkeys('ControlLeft+KeyA', () => console.log('hotkey pressed'));
 */
export const useHotkeys = (
  hotkeys: UseHotkeysHotkeys,
  callback: (event: KeyboardEvent) => void,
  options?: UseHotkeysOptions
) => {
  const enabled = options?.enabled ?? true;
  const preventDefault = options?.preventDefault ?? true;
  const [, setKeys] = React.useState<UseHotkeysKey[]>([]);

  const onKeyDown = useEvent((event: KeyboardEvent) => {
    if (preventDefault) event.preventDefault();

    if (!enabled) return;

    setKeys((prevKeys) => {
      if (prevKeys.some(({ code }) => code === event.code)) return prevKeys;
      const alias = options?.aliasMap?.[event.key] ?? options?.aliasMap?.[event.key] ?? event.code;
      const updatedKeys = [...prevKeys, { key: event.key, code: event.code, alias }];

      if (Array.isArray(hotkeys)) {
        hotkeys.forEach((hotkey) => {
          const isMatch = isHotkeyMatch(hotkey, updatedKeys);
          if (isMatch) callback(event);
        });
      } else {
        const isMatch = isHotkeyMatch(hotkeys, updatedKeys);
        if (isMatch) callback(event);
      }

      return updatedKeys;
    });
  });

  const onKeyUp = useEvent((event: KeyboardEvent) => {
    if (!enabled) return;
    setKeys((prevKeys) => prevKeys.filter(({ code }) => code !== event.code));
  });

  useDidUpdate(() => {
    setKeys([]);
  }, [enabled]);

  useEventListener(options?.target ?? window, 'keydown', onKeyDown);
  useEventListener(options?.target ?? window, 'keyup', onKeyUp);
};
