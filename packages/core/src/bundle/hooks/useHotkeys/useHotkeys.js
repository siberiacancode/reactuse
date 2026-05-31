import { useEffect, useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
export const isHotkeyMatch = (hotkey, keys) =>
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
export const useHotkeys = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const hotkeys = target ? params[1] : params[0];
  const options = target
    ? typeof params[2] === 'object'
      ? params[2]
      : { ...params[3], onChange: params[2] }
    : typeof params[1] === 'object'
      ? params[1]
      : { ...params[2], onChange: params[1] };
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const internalRef = useRefState();
  const keysRef = useRef([]);
  const enabled = options?.enabled ?? true;
  useEffect(() => {
    keysRef.current = [];
    if (!enabled) return;
    const eventTarget = (target ? isTarget.getElement(target) : internalRef.current) ?? window;
    if (!eventTarget) return;
    const onKeyDown = (event) => {
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
    const onKeyUp = (event) => {
      if (!enabled) return;
      keysRef.current = keysRef.current.filter(({ code }) => code !== event.code);
    };
    eventTarget.addEventListener('keydown', onKeyDown);
    eventTarget.addEventListener('keyup', onKeyUp);
    return () => {
      eventTarget.removeEventListener('keydown', onKeyDown);
      eventTarget.removeEventListener('keyup', onKeyUp);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, enabled, hotkeys]);
  if (target) return;
  return internalRef;
};
