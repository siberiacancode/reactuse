import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useEvent } from '../useEvent/useEvent';
import { useRefState } from '../useRefState/useRefState';

/** The use hotkeys params type */
export interface UseHotkeysOptions {
  /** Alias map for hotkeys */
  alias?: Record<string, string>;
  /** Enable or disable the event listeners */
  enabled?: boolean;
}

export const isHotkeyMatch = (hotkey: string, keys: UseHotkeysKey[]) =>
  hotkey
    .toLowerCase()
    .split(/[+_,\-]/g)
    .map((key) => key.trim())
    .every((key) =>
      keys.find(
        (updatedKey) =>
          key === updatedKey.code.toLocaleLowerCase() ||
          key === updatedKey.key.toLocaleLowerCase() ||
          key === updatedKey.alias.toLocaleLowerCase()
      )
    );

/** The hotkeys string type */
export type UseHotkeysHotkeys = string;

/** The hotkey key information */
export interface UseHotkeysKey {
  /** The alias for the key */
  alias: string;
  /** The key code */
  code: string;
  /** The key value */
  key: string;
}

/** The use hotkeys target type */
export type UseHotkeysTarget = Element | React.RefObject<Element | null | undefined>;

export interface UseHotkeys {
  (
    target: UseHotkeysTarget,
    hotkeys: UseHotkeysHotkeys,
    callback: (event: KeyboardEvent) => void,
    options?: UseHotkeysOptions
  ): void;

  <Target extends Element>(
    hotkeys: UseHotkeysHotkeys,
    callback: (event: KeyboardEvent) => void,
    options?: UseHotkeysOptions,
    target?: never
  ): StateRef<Target>;
}

/**
 * @name useHotkeys
 * @description - Hook that listens for hotkeys
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to attach the event listener to
 * @param {string} hotkeys The hotkey to listen for
 * @param {(event: KeyboardEvent) => void} callback The callback function to execute when hotkey is pressed
 * @param {Record<string, string>} [options.alias] Alias map for hotkeys
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @returns {void}
 *
 * @example
 * useHotkeys(ref, 'ctrl+a', () => console.log('hotkey pressed'));
 * @example
 * useHotkeys(ref, 'ctrl+a, ctrl+b', () => console.log('hotkey pressed'));
 *
 * @overload
 * @template Target The target element
 * @param {string} hotkeys The hotkey to listen for
 * @param {(event: KeyboardEvent) => void} callback The callback function to execute when hotkey is pressed
 * @param {Record<string, string>} [options.alias] Alias map for hotkeys
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @returns {StateRef<Target>} A reference to the target element
 *
 * @example
 * const ref = useHotkeys('ctrl+a', () => console.log('hotkey pressed'));
 * @example
 * const ref = useHotkeys('ctrl+a, ctrl+b', () => console.log('hotkey pressed'));
 */
export const useHotkeys = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const hotkeys = (target ? params[1] : params[0]) as UseHotkeysHotkeys;
  const callback = (target ? params[2] : params[1]) as (event: KeyboardEvent) => void;
  const options = (target ? params[3] : params[2]) as UseHotkeysOptions | undefined;

  const internalRef = useRefState(window);
  const keysRef = useRef<UseHotkeysKey[]>([]);
  const enabled = options?.enabled ?? true;

  const onKeyDown = useEvent((event: KeyboardEvent) => {
    if (!enabled) return;

    if (keysRef.current.some(({ code }) => code === event.code)) return;

    const alias = options?.alias?.[event.key] ?? event.code;
    const updatedKeys = [...keysRef.current, { key: event.key, code: event.code, alias }];
    keysRef.current = updatedKeys;

    const hotkeysList = hotkeys.split(',').map((h) => h.trim());
    const isMatch = hotkeysList.some((hotkey) => isHotkeyMatch(hotkey, updatedKeys));
    if (!isMatch) return;
    event.preventDefault();
    callback(event);
  });

  const onKeyUp = useEvent((event: KeyboardEvent) => {
    if (!enabled) return;
    keysRef.current = keysRef.current.filter(({ code }) => code !== event.code);
  });

  useEffect(() => {
    keysRef.current = [];
    if (!target && !internalRef.state && !enabled) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    if (!element) return;

    element.addEventListener('keydown', onKeyDown as EventListener);
    element.addEventListener('keyup', onKeyUp as EventListener);

    return () => {
      element.removeEventListener('keydown', onKeyDown as EventListener);
      element.removeEventListener('keyup', onKeyUp as EventListener);
    };
  }, [target, internalRef.state, enabled, hotkeys, onKeyDown, onKeyUp]);

  if (target) return;
  return internalRef;
}) as UseHotkeys;
