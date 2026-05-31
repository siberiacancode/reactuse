import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use hotkeys params type */
export interface UseHotkeysOptions {
  /** Alias map for hotkeys */
  alias?: Record<string, string>;
  /** Enable or disable the event listeners */
  enabled?: boolean;
  /** The callback function to execute when hotkey is pressed */
  onChange?: (event: KeyboardEvent) => void;
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

export interface UseHotkeys {
  (target: HookTarget, hotkeys: UseHotkeysHotkeys, options?: UseHotkeysOptions): void;

  (
    target: HookTarget,
    hotkeys: UseHotkeysHotkeys,
    callback: (event: KeyboardEvent) => void,
    options?: UseHotkeysOptions
  ): void;

  <Target extends Element>(
    hotkeys: UseHotkeysHotkeys,
    options?: UseHotkeysOptions,
    target?: never
  ): StateRef<Target>;

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
 * @param {UseHotkeysOptions} [options] The options for the hook
 * @returns {void}
 *
 * @example
 * useHotkeys(ref, 'ctrl+a', { onChange: () => console.log('hotkey pressed') });
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
 *
 * @overload
 * @template Target The target element
 * @param {string} hotkeys The hotkey to listen for
 * @param {UseHotkeysOptions} [options] The options for the hook
 * @returns {StateRef<Target>} A reference to the target element
 *
 * @example
 * const ref = useHotkeys('ctrl+a', { onChange: () => console.log('hotkey pressed') });
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
 */
export const useHotkeys = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const hotkeys = (target ? params[1] : params[0]) as UseHotkeysHotkeys;
  const options = (
    target
      ? typeof params[2] === 'object'
        ? params[2]
        : { ...params[3], onChange: params[2] }
      : typeof params[1] === 'object'
        ? params[1]
        : { ...params[2], onChange: params[1] }
  ) as UseHotkeysOptions | undefined;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const internalRef = useRefState<Element | Window>();
  const keysRef = useRef<UseHotkeysKey[]>([]);
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    keysRef.current = [];
    if (!enabled) return;

    const eventTarget =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element | Window) ?? window;
    if (!eventTarget) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!enabled) return;

      if (keysRef.current.some(({ code }) => code === event.code)) return;

      const alias = options?.alias?.[event.key] ?? event.code;
      const updatedKeys = [...keysRef.current, { key: event.key, code: event.code, alias }];
      keysRef.current = updatedKeys;

      const hotkeysList = hotkeys.split(',').map((h) => h.trim());
      const isMatch = hotkeysList.some((hotkey) => isHotkeyMatch(hotkey, updatedKeys));
      if (!isMatch) return;
      event.preventDefault();
      optionsRef.current?.onChange?.(event);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (!enabled) return;
      keysRef.current = keysRef.current.filter(({ code }) => code !== event.code);
    };

    eventTarget.addEventListener('keydown', onKeyDown as EventListener);
    eventTarget.addEventListener('keyup', onKeyUp as EventListener);

    return () => {
      eventTarget.removeEventListener('keydown', onKeyDown as EventListener);
      eventTarget.removeEventListener('keyup', onKeyUp as EventListener);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, enabled, hotkeys]);

  if (target) return;
  return internalRef;
}) as UseHotkeys;
